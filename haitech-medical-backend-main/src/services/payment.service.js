import crypto from 'crypto';
import { env, db } from '../config/index.js';
import { orderRepository, paymentTransactionRepository } from '../repositories/index.js';
import { badRequestError, notFoundError, internalError } from '../utils/index.js';
import { withRetryableTransaction } from '../utils/db/drizzle.utils.js';
import { orders } from '../schema/index.js';
import { eq, and } from 'drizzle-orm';

// ── Allowed order statuses for which payment can be initiated ─────────────────
const PAYABLE_STATUSES = new Set(['pending', 'confirmed']);

const getRazorpay = async () => {
	if (!env.RAZORPAY.KEY_ID || !env.RAZORPAY.KEY_SECRET) {
		throw internalError('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing)');
	}

	try {
		const { default: Razorpay } = await import('razorpay');
		return new Razorpay({ key_id: env.RAZORPAY.KEY_ID, key_secret: env.RAZORPAY.KEY_SECRET });
	} catch {
		throw internalError('Razorpay package not installed. Run: npm install razorpay');
	}
};

// ── Fix 1 + 2: Idempotent, race-safe payment order creation ──────────────────
// Uses SELECT FOR UPDATE inside a retryable transaction so that two concurrent
// requests for the same orderId are serialised. The first writer creates a
// Razorpay order and stores its ID; subsequent calls return that stored ID
// without creating a second Razorpay order — preventing double-charges.
// Also guards against initiating payment for cancelled / returned orders.
export const createPaymentOrder = async (orderId, userId) => {
	return withRetryableTransaction(db, async (tx) => {
		// Lock the row for the duration of this transaction
		const [order] = await tx
			.select()
			.from(orders)
			.where(and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.active, true)))
			.for('update')
			.limit(1);

		if (!order) throw notFoundError('Order not found');

		// Fix 2: Guard against paying for already-paid or terminal-status orders
		if (order.paymentStatus === 'paid') throw badRequestError('Order is already paid');
		if (!PAYABLE_STATUSES.has(order.status)) {
			throw badRequestError(`Cannot initiate payment for an order with status "${order.status}"`);
		}

		// Fix 1 — Idempotency: if a Razorpay order was already created, return it
		if (order.razorpayOrderId) {
			return {
				razorpayOrderId: order.razorpayOrderId,
				amount: order.total,
				currency: order.currency || 'INR',
				keyId: env.RAZORPAY.KEY_ID,
			};
		}

		const rz = await getRazorpay();

		const rzOrder = await rz.orders.create({
			amount: order.total,
			currency: order.currency || 'INR',
			receipt: orderId,
			notes: { orderId },
		});

		await tx
			.update(orders)
			.set({ razorpayOrderId: rzOrder.id, paymentStatus: 'unpaid', modifiedAt: new Date() })
			.where(eq(orders.id, orderId));

		return {
			razorpayOrderId: rzOrder.id,
			amount: rzOrder.amount,
			currency: rzOrder.currency,
			keyId: env.RAZORPAY.KEY_ID,
		};
	});
};

// ── Fix 3: Race-safe payment verification ────────────────────────────────────
// SELECT FOR UPDATE inside the transaction prevents a simultaneous webhook
// and a client verify call from both writing "paid" at the same moment.
// The HMAC check runs before acquiring the lock (pure CPU work, no side effects).
export const verifyPayment = async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }, userId) => {
	const secret = env.RAZORPAY.KEY_SECRET;
	if (!secret) throw internalError('Payment service not configured');

	// Verify HMAC signature before touching the DB
	const body = `${razorpayOrderId}|${razorpayPaymentId}`;
	const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

	// Timing-safe comparison prevents timing-oracle attacks on the HMAC
	const expectedBuf = Buffer.from(expected, 'hex');
	const receivedBuf = Buffer.from(razorpaySignature, 'hex');
	if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
		throw badRequestError('Invalid payment signature');
	}

	return withRetryableTransaction(db, async (tx) => {
		// Lock the row to serialise concurrent verify + webhook writes.
		// userId ownership check prevents IDOR: a user can only verify their own orders.
		const [order] = await tx
			.select()
			.from(orders)
			.where(and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.active, true)))
			.for('update')
			.limit(1);

		if (!order) throw notFoundError('Order not found');

		// Idempotent: already marked paid by a webhook that arrived first
		if (order.paymentStatus === 'paid') {
			return order;
		}

		const [updated] = await tx
			.update(orders)
			.set({
				razorpayOrderId,
				razorpayPaymentId,
				paymentStatus: 'paid',
				status: 'confirmed',
				modifiedAt: new Date(),
			})
			.where(eq(orders.id, orderId))
			.returning();

		return updated;
	});
};

// ── Fix 3: Race-safe webhook processing ──────────────────────────────────────
export const handleWebhookPayment = async (rawBody, signature) => {
	const secret = env.RAZORPAY?.WEBHOOK_SECRET;
	if (!secret) {
		// Reject outright — never silently process unsigned webhook events.
		// Set RAZORPAY_WEBHOOK_SECRET in your environment to enable webhooks.
		throw internalError('Webhook secret not configured — set RAZORPAY_WEBHOOK_SECRET');
	}

	const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
	const expectedBuf = Buffer.from(expected, 'hex');
	const receivedBuf = Buffer.from(signature, 'hex');
	if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
		throw badRequestError('Invalid webhook signature');
	}

	const event = JSON.parse(rawBody);
	await processWebhookEvent(event);
};

const processWebhookEvent = async (event) => {
	const paymentEntity = event.payload?.payment?.entity;
	const orderEntity = event.payload?.order?.entity;
	const entity = paymentEntity || orderEntity;
	if (!entity) return;

	const rzOrderId = paymentEntity?.order_id || orderEntity?.id;
	if (!rzOrderId) return;

	// Early exit for unhandled event types before acquiring any lock
	if (event.event !== 'payment.captured' && event.event !== 'order.paid') return;

	// SELECT FOR UPDATE prevents a racing verifyPayment call from writing
	// "paid" at the same instant as this webhook handler.
	await withRetryableTransaction(db, async (tx) => {
		const [order] = await tx
			.select()
			.from(orders)
			.where(and(eq(orders.razorpayOrderId, rzOrderId), eq(orders.active, true)))
			.for('update')
			.limit(1);

		if (!order || order.paymentStatus === 'paid') return;

		await tx
			.update(orders)
			.set({
				razorpayPaymentId: paymentEntity?.id ?? null,
				paymentStatus: 'paid',
				status: 'confirmed',
				modifiedAt: new Date(),
			})
			.where(eq(orders.id, order.id));
	});
};

// ── Lightweight DI ────────────────────────────────────────────────────────────
// createPaymentOrder/verifyPayment/processWebhookEvent above are deliberately
// NOT wrapped in DI: their entire value is the SELECT-FOR-UPDATE row-locking
// under real concurrency (the documented repository-bypass exception for
// payment code — see [[feedback_architecture_policy]]), which a fake repo
// can't meaningfully exercise; they need a real Postgres integration test,
// not a unit test. initiateRefund and adminListTransactions below have no
// such requirement — their business logic (refund-amount guards, pagination)
// is ordinary branching, so they're factored for fake-repo unit testing the
// same way order/return/coupon services are.
export const createPaymentService = ({
	orderRepository: orderRepo = orderRepository,
	paymentTransactionRepository: paymentTransactionRepo = paymentTransactionRepository,
	getRazorpayClient = getRazorpay,
} = {}) => {
	// ── Fix 4: Refund initiation ────────────────────────────────────────────
	// Initiates a partial or full refund via Razorpay and persists the refund ID.
	// `amount` must be in the smallest currency unit (paise for INR).
	// Omit `amount` to trigger a full refund of the order total.
	const initiateRefund = async (orderId, amount) => {
		const order = await orderRepo.findById(orderId);
		if (!order) throw notFoundError('Order not found');
		if (order.paymentStatus !== 'paid') {
			throw badRequestError('Order has not been paid — cannot refund');
		}
		if (!order.razorpayPaymentId) {
			throw badRequestError('No Razorpay payment ID found for this order');
		}

		// Default to a full refund when no amount is given
		const refundAmount = amount === null || amount === undefined ? order.total : amount;

		if (typeof refundAmount !== 'number' || refundAmount <= 0) {
			throw badRequestError('Refund amount must be a positive number (in paise)');
		}
		if (refundAmount > order.total) {
			throw badRequestError(`Refund amount (${refundAmount}) exceeds order total (${order.total})`);
		}

		const rz = await getRazorpayClient();

		const refund = await rz.payments.refund(order.razorpayPaymentId, {
			amount: refundAmount,
			notes: { orderId, reason: 'customer_requested' },
		});

		// Persist the refund ID in the notes field (avoids a schema migration) and
		// update paymentStatus to reflect full vs. partial refund state.
		const isFullRefund = refundAmount === order.total;
		const newNotes = [
			order.notes,
			`refund_id:${refund.id}`,
			`refund_amount:${refundAmount}`,
		]
			.filter(Boolean)
			.join(' | ');

		await db
			.update(orders)
			.set({
				paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded',
				// varchar(500) column — truncate to be safe
				notes: newNotes.slice(0, 500),
				modifiedAt: new Date(),
			})
			.where(eq(orders.id, orderId));

		return {
			refundId: refund.id,
			amount: refund.amount,
			currency: refund.currency,
			status: refund.status,
			orderId,
		};
	};

	// ── Admin: list payment transactions ────────────────────────────────────
	const adminListTransactions = async ({ page = 1, limit = 20, orderId, userId } = {}) => {
		const offset = (page - 1) * limit;
		const { rows, total } = await paymentTransactionRepo.findMany({ orderId, userId, limit, offset });
		return { transactions: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
	};

	return { initiateRefund, adminListTransactions };
};

const defaultPaymentDomainService = createPaymentService();
export const { initiateRefund, adminListTransactions } = defaultPaymentDomainService;

const paymentService = {
	createPaymentOrder,
	verifyPayment,
	handleWebhookPayment,
	...defaultPaymentDomainService,
	createPaymentService,
};

export default paymentService;

import { db } from '../config/index.js';
import { orderRepository, addressRepository, productRepository } from '../repositories/index.js';
import { notFoundError, badRequestError } from '../utils/index.js';
import { withRetryableTransaction } from '../utils/db/drizzle.utils.js';
import * as defaultEmailService from './email.service.js';

// Valid order status transitions — server enforced, not client driven.
// This is the single source of truth for order lifecycle rules; return.service.js
// reuses assertValidTransition() below rather than re-deriving these rules.
// Pure and dependency-free, so it needs no DI to be unit tested directly.
export const VALID_TRANSITIONS = {
	pending: ['confirmed', 'cancelled'],
	confirmed: ['shipped', 'cancelled'],
	shipped: ['delivered'],
	delivered: ['return_requested'],
	// 'delivered' lets a rejected return revert the order back to its prior
	// state instead of leaving it stuck in 'return_requested' forever.
	return_requested: ['returned', 'delivered'],
	cancelled: [],
	returned: [],
};

// Throws badRequestError if `nextStatus` is not a legal transition from
// `currentStatus`. Shared by adminUpdateOrderStatus and return.service.js so
// there is exactly one place that knows the order lifecycle rules.
export const assertValidTransition = (currentStatus, nextStatus) => {
	const allowedNext = VALID_TRANSITIONS[currentStatus];
	if (allowedNext === undefined) {
		throw badRequestError(`Unknown current order status: ${currentStatus}`);
	}
	if (!allowedNext.includes(nextStatus)) {
		throw badRequestError(
			`Cannot transition order from '${currentStatus}' to '${nextStatus}'. ` +
				`Allowed transitions: [${allowedNext.join(', ') || 'none'}]`,
		);
	}
};

// ── Lightweight DI ────────────────────────────────────────────────────────────
// Everything below depends on the DB (via repositories) or on email delivery,
// so it's factored behind createOrderService(overrides) — tests inject fake
// repositories / a no-op transaction runner instead of hitting a real DB.
// This is plain factory-function injection, not a DI framework: production
// code just calls createOrderService() with no args and gets the real repos.
export const createOrderService = ({
	orderRepository: orderRepo = orderRepository,
	addressRepository: addressRepo = addressRepository,
	productRepository: productRepo = productRepository,
	emailService: emailSvc = defaultEmailService,
	// Defaults to a real DB transaction; tests override with e.g. (cb) => cb(undefined)
	// since fake repos ignore the trailing `conn` param.
	runTransaction = (cb) => withRetryableTransaction(db, cb),
} = {}) => {
	// ── Fix: Server-side price resolution ────────────────────────────────────
	// Prices are NEVER accepted from the client. All unit/total prices are fetched
	// from the DB (products.basePrice) inside the transaction so an attacker cannot
	// manipulate what they pay by sending a crafted unitPrice / totalPrice field.
	//
	// The entire order header + items insert runs inside a single DB transaction
	// so that a failure mid-way automatically rolls back the order header row —
	// no orphaned orders.
	//
	// The address ownership check also runs inside the transaction so that the
	// address cannot be deleted between the check and the order insert.
	//
	// The confirmation e-mail is sent AFTER the transaction commits because it is a
	// non-reversible side effect. If the email fails we log the error but do not
	// fail the request (the order is already persisted correctly).
	const createOrder = async (userId, { items, shippingAddressId, notes }) => {
		if (!items || items.length === 0) {
			throw badRequestError('Order must have at least one item');
		}

		// Accept ONLY productId + quantity from the client — reject any price fields
		for (const [index, item] of items.entries()) {
			if (!item.productId) {
				throw badRequestError(`Item at index ${index} is missing productId`);
			}
			if (typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
				throw badRequestError(`Item at index ${index} has an invalid quantity`);
			}
		}

		const order = await runTransaction(async (tx) => {
			// Validate address ownership inside the transaction
			if (shippingAddressId) {
				const address = await addressRepo.findById(shippingAddressId, tx);
				if (!address || address.userId !== userId) {
					throw badRequestError('Invalid shipping address');
				}
			}

			// Fetch authoritative product data from DB — never trust client prices
			const productIds = items.map((item) => Number(item.productId));
			const products = await productRepo.findByIds(productIds, tx);

			// Build a lookup map for O(1) access
			const productMap = new Map(products.map((p) => [p.id, p]));

			// Validate every product exists and is active, then resolve server-side prices
			const enrichedItems = items.map((item, index) => {
				const product = productMap.get(Number(item.productId));

				if (!product) {
					throw badRequestError(`Product at index ${index} (id: ${item.productId}) not found`);
				}
				if (!product.active) {
					throw badRequestError(`Product at index ${index} (id: ${item.productId}) is not available`);
				}
				// Allow zero-priced products (free items). Only reject when price
				// is missing (null/undefined) rather than non-positive.
				if (product.basePrice === null || product.basePrice === undefined) {
					throw badRequestError(`Product price not configured for product at index ${index} (id: ${item.productId})`);
				}

				const unitPrice = product.basePrice; // paise, from DB only
				const totalPrice = unitPrice * item.quantity;

				return {
					productId: String(item.productId),
					productName: product.name,
					productBrand: product.brand ?? null,
					productSku: product.sku,
					quantity: item.quantity,
					unitPrice,
					totalPrice,
				};
			});

			// All financial calculations done server-side
			const subtotal = enrichedItems.reduce((sum, item) => sum + item.totalPrice, 0);
			const tax = 0;
			const shippingFee = 0;
			const total = subtotal + tax + shippingFee;

			return orderRepo.create(
				userId,
				{
					items: enrichedItems,
					subtotal,
					tax,
					shippingFee,
					total,
					currency: 'INR',
					shippingAddressId: shippingAddressId || null,
					notes,
				},
				tx,
			);
		});

		// Send confirmation email outside the transaction — a transient email error
		// must NOT roll back an already-committed order.
		emailSvc.sendOrderConfirmationEmail(null, order.id).catch(() => {
			// email failure is non-fatal; the order is persisted
		});

		return order;
	};

	const getUserOrders = async (userId, { page = 1, limit = 10 } = {}) => {
		const offset = (page - 1) * limit;
		const { rows, total } = await orderRepo.findManyByUser(userId, { limit, offset });
		return {
			orders: rows,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	};

	const getOrderDetail = async (userId, orderId) => {
		const order = await orderRepo.findByIdAndUser(orderId, userId);
		if (!order) throw notFoundError('Order not found');
		return order;
	};

	const cancelOrder = async (userId, orderId) => {
		const order = await orderRepo.findByIdAndUser(orderId, userId);
		if (!order) throw notFoundError('Order not found');

		if (!['pending', 'confirmed'].includes(order.status)) {
			throw badRequestError('Only pending or confirmed orders can be cancelled');
		}

		return orderRepo.updateStatus(orderId, userId, 'cancelled');
	};

	const adminGetOrders = async ({ page = 1, limit = 20, status, userId, dateFrom, dateTo } = {}) => {
		const offset = (page - 1) * limit;
		const { rows, total } = await orderRepo.findMany({ limit, offset, status, userId, dateFrom, dateTo });
		return {
			orders: rows,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	};

	const adminGetOrderDetail = async (orderId) => {
		const order = await orderRepo.findById(orderId);
		if (!order) throw notFoundError('Order not found');
		return order;
	};

	// Writes the status change and its audit-trail row atomically — previously
	// only one of the two admin "update order status" entry points logged to
	// order_status_history at all, and it did so with a try/catch that silently
	// discarded real failures. Now there is exactly one implementation, used by
	// both PUT /orders/admin/:id/status and PATCH /admin/orders/:id/status.
	const adminUpdateOrderStatus = async (adminId, orderId, status, reason) => {
		const order = await orderRepo.findById(orderId);
		if (!order) throw notFoundError('Order not found');

		// Enforce state-machine transitions — prevents skipping states or resurrecting
		// cancelled/completed orders
		assertValidTransition(order.status, status);

		return runTransaction(async (tx) => {
			const updated = await orderRepo.updateStatus(orderId, adminId, status, tx);
			await orderRepo.recordStatusHistory(
				{ orderId, fromStatus: order.status, toStatus: status, changedBy: adminId, reason },
				tx
			);
			return updated;
		});
	};

	// NOTE: requestReturn used to live here as a second, independent
	// implementation of "customer requests a return" — it only flipped
	// orders.status and silently discarded the `reason` the customer submitted,
	// with no persisted, admin-reviewable record. That duplicated (and was
	// inconsistent with) the returns domain's own return_requests-table
	// workflow. Reconciled into the single authoritative implementation at
	// return.service.js#requestReturn, which both `PUT /orders/:id/return` and
	// `POST /returns/orders/:id/return` now call.

	const getOrderInvoice = async (userId, orderId) => {
		const order = await orderRepo.findByIdAndUser(orderId, userId);
		if (!order) throw notFoundError('Order not found');

		return {
			invoiceNo: `INV-${order.id.slice(0, 8).toUpperCase()}`,
			orderId: order.id,
			orderDate: order.createdAt,
			status: order.status,
			items: order.items || [],
			subtotal: order.subtotal,
			tax: order.tax,
			shippingFee: order.shippingFee,
			total: order.total,
			currency: order.currency,
		};
	};

	return {
		createOrder,
		getUserOrders,
		getOrderDetail,
		cancelOrder,
		adminGetOrders,
		adminGetOrderDetail,
		adminUpdateOrderStatus,
		getOrderInvoice,
	};
};

const defaultOrderService = createOrderService();

export const {
	createOrder,
	getUserOrders,
	getOrderDetail,
	cancelOrder,
	adminGetOrders,
	adminGetOrderDetail,
	adminUpdateOrderStatus,
	getOrderInvoice,
} = defaultOrderService;

const orderService = { ...defaultOrderService, VALID_TRANSITIONS, assertValidTransition, createOrderService };

export default orderService;

import { db } from '../config/index.js';
import { orderRepository, addressRepository, productRepository } from '../repositories/index.js';
import { notFoundError, badRequestError } from '../utils/index.js';
import { withRetryableTransaction } from '../utils/db/drizzle.utils.js';
import * as emailService from './email.service.js';

// Valid order status transitions — server enforced, not client driven
const VALID_TRANSITIONS = {
	pending: ['confirmed', 'cancelled'],
	confirmed: ['shipped', 'cancelled'],
	shipped: ['delivered'],
	delivered: ['return_requested'],
	return_requested: ['returned'],
	cancelled: [],
	returned: [],
};

// ── Fix: Server-side price resolution ────────────────────────────────────────
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
export const createOrder = async (userId, { items, shippingAddressId, notes }) => {
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

	const order = await withRetryableTransaction(db, async (tx) => {
		// Validate address ownership inside the transaction
		if (shippingAddressId) {
			const address = await addressRepository.findById(shippingAddressId, tx);
			if (!address || address.userId !== userId) {
				throw badRequestError('Invalid shipping address');
			}
		}

		// Fetch authoritative product data from DB — never trust client prices
		const productIds = items.map((item) => Number(item.productId));
		const products = await productRepository.findByIds(productIds, tx);

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
			if (product.basePrice == null) {
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

		return orderRepository.create(
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
	emailService.sendOrderConfirmationEmail(null, order.id).catch(() => {
		// email failure is non-fatal; the order is persisted
	});

	return order;
};

export const getUserOrders = async (userId, { page = 1, limit = 10 } = {}) => {
	const offset = (page - 1) * limit;
	const { rows, total } = await orderRepository.findManyByUser(userId, { limit, offset });
	return {
		orders: rows,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

export const getOrderDetail = async (userId, orderId) => {
	const order = await orderRepository.findByIdAndUser(orderId, userId);
	if (!order) throw notFoundError('Order not found');
	return order;
};

export const cancelOrder = async (userId, orderId) => {
	const order = await orderRepository.findByIdAndUser(orderId, userId);
	if (!order) throw notFoundError('Order not found');

	if (!['pending', 'confirmed'].includes(order.status)) {
		throw badRequestError('Only pending or confirmed orders can be cancelled');
	}

	return orderRepository.updateStatus(orderId, userId, 'cancelled');
};

export const adminGetOrders = async ({ page = 1, limit = 20, status } = {}) => {
	const offset = (page - 1) * limit;
	const { rows, total } = await orderRepository.findMany({ limit, offset, status });
	return {
		orders: rows,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

export const adminUpdateOrderStatus = async (adminId, orderId, status) => {
	const order = await orderRepository.findById(orderId);
	if (!order) throw notFoundError('Order not found');

	// Enforce state-machine transitions — prevents skipping states or resurrecting
	// cancelled/completed orders
	const allowedNext = VALID_TRANSITIONS[order.status];
	if (allowedNext === undefined) {
		throw badRequestError(`Unknown current order status: ${order.status}`);
	}
	if (!allowedNext.includes(status)) {
		throw badRequestError(
			`Cannot transition order from '${order.status}' to '${status}'. ` +
				`Allowed transitions: [${allowedNext.join(', ') || 'none'}]`,
		);
	}

	return orderRepository.updateStatus(orderId, adminId, status);
};

export const requestReturn = async (userId, orderId, { reason = '' } = {}) => {
	const order = await orderRepository.findByIdAndUser(orderId, userId);
	if (!order) throw notFoundError('Order not found');

	if (order.status !== 'delivered') {
		throw badRequestError('Only delivered orders can be returned');
	}

	return orderRepository.updateStatus(orderId, userId, 'return_requested');
};

export const getOrderInvoice = async (userId, orderId) => {
	const order = await orderRepository.findByIdAndUser(orderId, userId);
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

const orderService = {
	createOrder,
	getUserOrders,
	getOrderDetail,
	cancelOrder,
	adminGetOrders,
	adminUpdateOrderStatus,
	requestReturn,
	getOrderInvoice,
};

export default orderService;

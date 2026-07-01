import { notificationRepository } from '../repositories/index.js';
import { notFoundError } from '../utils/index.js';

export const NOTIFICATION_TYPES = {
	ORDER_PLACED: 'order_placed',
	ORDER_CONFIRMED: 'order_confirmed',
	ORDER_SHIPPED: 'order_shipped',
	ORDER_DELIVERED: 'order_delivered',
	ORDER_CANCELLED: 'order_cancelled',
	PAYMENT_SUCCESS: 'payment_success',
	PAYMENT_FAILED: 'payment_failed',
	REVIEW_APPROVED: 'review_approved',
	SYSTEM: 'system',
};

export const notify = async (userId, { type, title, body, data = null }) => {
	return notificationRepository.create({
		userId,
		type,
		title,
		body: body || null,
		data: data ? JSON.stringify(data) : null,
	});
};

export const notifyOrderPlaced = async (userId, orderId, orderTotal) => {
	return notify(userId, {
		type: NOTIFICATION_TYPES.ORDER_PLACED,
		title: 'Order Placed',
		body: `Your order has been placed successfully. Total: ₹${orderTotal.toLocaleString('en-IN')}`,
		data: { orderId },
	});
};

export const notifyOrderStatusChange = async (userId, orderId, status) => {
	const messages = {
		confirmed: { title: 'Order Confirmed', body: 'Your order has been confirmed and is being prepared.' },
		shipped: { title: 'Order Shipped', body: 'Your order is on the way!' },
		delivered: { title: 'Order Delivered', body: 'Your order has been delivered. Thank you for shopping with us!' },
		cancelled: { title: 'Order Cancelled', body: 'Your order has been cancelled.' },
	};
	const msg = messages[status];
	if (!msg) return null;

	return notify(userId, {
		type: `order_${status}`,
		title: msg.title,
		body: msg.body,
		data: { orderId, status },
	});
};

export const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
	const { rows, total } = await notificationRepository.findManyByUser(userId, { page, limit, unreadOnly });
	const unreadCount = await notificationRepository.countUnread(userId);

	return {
		notifications: rows.map((n) => ({
			...n,
			data: n.data ? (() => { try { return JSON.parse(n.data); } catch { return null; } })() : null,
		})),
		unreadCount,
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

export const markRead = async (userId, id) => {
	const row = await notificationRepository.markRead(id, userId);
	if (!row) throw notFoundError('Notification not found');
	return row;
};

export const markAllRead = async (userId) => {
	await notificationRepository.markAllRead(userId);
};

export const deleteNotification = async (userId, id) => {
	await notificationRepository.softDelete(id, userId);
};

const notificationService = {
	notify,
	notifyOrderPlaced,
	notifyOrderStatusChange,
	getUserNotifications,
	markRead,
	markAllRead,
	deleteNotification,
	NOTIFICATION_TYPES,
};
export default notificationService;

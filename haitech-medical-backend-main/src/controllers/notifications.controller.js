import { httpStatus } from '../constants/index.js';
import { notificationService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const getNotifications = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, unread } = req.query;
	const result = await notificationService.getUserNotifications(req.user.id, {
		page: Number(page),
		limit: Number(limit),
		unreadOnly: unread === 'true',
	});
	return res.respond(httpStatus.OK, result);
});

export const markNotificationRead = catchAsync(async (req, res) => {
	const notification = await notificationService.markRead(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { notification });
});

export const markAllNotificationsRead = catchAsync(async (req, res) => {
	await notificationService.markAllRead(req.user.id);
	return res.respond(httpStatus.OK, null, 'All notifications marked as read');
});

export const deleteNotification = catchAsync(async (req, res) => {
	await notificationService.deleteNotification(req.user.id, req.params.id);
	return res.respond(httpStatus.NO_CONTENT, null);
});

import { Router } from 'express';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../controllers/index.js';
import { auth, overallLimiter } from '../middlewares/index.js';

const notificationsRouter = Router();

notificationsRouter.use(overallLimiter, auth());

notificationsRouter.get('/', getNotifications);
notificationsRouter.put('/read-all', markAllNotificationsRead);
notificationsRouter.put('/:id/read', markNotificationRead);
notificationsRouter.delete('/:id', deleteNotification);

export default notificationsRouter;

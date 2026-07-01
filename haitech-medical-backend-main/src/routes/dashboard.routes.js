import { Router } from 'express';
import { getDashboardSummary, getOrderStats, getUserStats, getTopProducts, getRevenueByDay } from '../controllers/index.js';
import { auth, overallLimiter } from '../middlewares/index.js';

const dashboardRouter = Router();

dashboardRouter.use(overallLimiter, auth('admin'));

dashboardRouter.get('/summary', getDashboardSummary);
dashboardRouter.get('/orders/stats', getOrderStats);
dashboardRouter.get('/users/stats', getUserStats);
dashboardRouter.get('/products/top', getTopProducts);
dashboardRouter.get('/revenue/daily', getRevenueByDay);

export default dashboardRouter;

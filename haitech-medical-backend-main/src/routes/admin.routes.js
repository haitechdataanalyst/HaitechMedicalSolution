import { Router } from 'express';
import { auth, validate, jsonBody, adminLimiter } from '../middlewares/index.js';
import {
  adminGetAllOrders, adminGetOrderDetail, adminUpdateOrder,
  adminGetAllUsers, adminToggleUserStatus,
  adminGetInventory, adminUpdateInventory,
  adminGetPaymentTransactions, adminInitiateRefund,
  adminListCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
  adminGetRevenue,
} from '../controllers/admin.controller.js';
import { adminOrderListSchema, adminUpdateStatusSchema } from '../validations/orders.validation.js';

const adminRouter = Router();

// All routes require admin role + admin-specific rate limit
adminRouter.use(adminLimiter, auth('admin'));

// Orders
adminRouter.get('/orders', validate(adminOrderListSchema), adminGetAllOrders);
adminRouter.get('/orders/:id', adminGetOrderDetail);
adminRouter.patch('/orders/:id/status', jsonBody('10kb'), validate(adminUpdateStatusSchema), adminUpdateOrder);

// Users
adminRouter.get('/users', adminGetAllUsers);
adminRouter.patch('/users/:id/status', jsonBody('5kb'), adminToggleUserStatus);

// Inventory
adminRouter.get('/inventory', adminGetInventory);
adminRouter.patch('/inventory/:productId', jsonBody('5kb'), adminUpdateInventory);

// Payments
adminRouter.get('/payment-transactions', adminGetPaymentTransactions);
adminRouter.post('/orders/:id/refund', jsonBody('10kb'), adminInitiateRefund);

// Coupons
adminRouter.get('/coupons', adminListCoupons);
adminRouter.post('/coupons', jsonBody('10kb'), adminCreateCoupon);
adminRouter.patch('/coupons/:id', jsonBody('10kb'), adminUpdateCoupon);
adminRouter.delete('/coupons/:id', adminDeleteCoupon);

// Revenue analytics
adminRouter.get('/revenue', adminGetRevenue);

export default adminRouter;

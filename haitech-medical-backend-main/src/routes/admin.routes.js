import { Router } from 'express';
import { auth, validate, jsonBody, adminLimiter } from '../middlewares/index.js';
import { adminGetAllOrders, adminGetOrderDetail, adminUpdateOrder } from '../controllers/admin-orders.controller.js';
import { adminGetAllUsers, adminToggleUserStatus } from '../controllers/admin-users.controller.js';
import { adminGetInventory, adminUpdateInventory } from '../controllers/admin-inventory.controller.js';
import { adminGetPaymentTransactions, adminInitiateRefund } from '../controllers/admin-payments.controller.js';
import {
  adminListCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
} from '../controllers/admin-coupons.controller.js';
import { adminGetRevenue } from '../controllers/admin-revenue.controller.js';
import { adminOrderListSchema, adminUpdateStatusSchema } from '../validations/orders.validation.js';
import { createCouponSchema, updateCouponSchema, couponIdSchema } from '../validations/coupons.validation.js';
import {
  adminUserListSchema,
  adminUserIdSchema,
  adminInventoryListSchema,
  adminUpdateInventorySchema,
  adminPaymentTransactionsSchema,
  adminOrderIdSchema,
  adminRefundSchema,
} from '../validations/admin.validation.js';

const adminRouter = Router();

// All routes require admin role + admin-specific rate limit
adminRouter.use(adminLimiter, auth('admin'));

// Orders
adminRouter.get('/orders', validate(adminOrderListSchema), adminGetAllOrders);
adminRouter.get('/orders/:id', validate(adminOrderIdSchema), adminGetOrderDetail);
adminRouter.patch('/orders/:id/status', jsonBody('10kb'), validate(adminUpdateStatusSchema), adminUpdateOrder);

// Users
adminRouter.get('/users', validate(adminUserListSchema), adminGetAllUsers);
adminRouter.patch('/users/:id/status', jsonBody('5kb'), validate(adminUserIdSchema), adminToggleUserStatus);

// Inventory
adminRouter.get('/inventory', validate(adminInventoryListSchema), adminGetInventory);
adminRouter.patch('/inventory/:productId', jsonBody('5kb'), validate(adminUpdateInventorySchema), adminUpdateInventory);

// Payments
adminRouter.get('/payment-transactions', validate(adminPaymentTransactionsSchema), adminGetPaymentTransactions);
adminRouter.post('/orders/:id/refund', jsonBody('10kb'), validate(adminRefundSchema), adminInitiateRefund);

// Coupons — reuses the same validation schemas as the customer-facing
// /coupons router (coupons.validation.js) so both entry points enforce
// identical rules instead of drifting independently.
adminRouter.get('/coupons', adminListCoupons);
adminRouter.post('/coupons', jsonBody('10kb'), validate(createCouponSchema), adminCreateCoupon);
adminRouter.patch('/coupons/:id', jsonBody('10kb'), validate(updateCouponSchema), adminUpdateCoupon);
adminRouter.delete('/coupons/:id', validate(couponIdSchema), adminDeleteCoupon);

// Revenue analytics
adminRouter.get('/revenue', adminGetRevenue);

export default adminRouter;

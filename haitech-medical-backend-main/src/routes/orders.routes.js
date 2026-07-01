import { Router } from 'express';
import { createOrder, getOrders, getOrder, cancelOrder, adminGetOrders, adminUpdateOrderStatus, requestReturn, getOrderInvoice } from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter } from '../middlewares/index.js';
import {
	createOrderSchema,
	orderIdSchema,
	orderListSchema,
	adminOrderListSchema,
	adminUpdateStatusSchema,
} from '../validations/orders.validation.js';

const ordersRouter = Router();

ordersRouter.use(overallLimiter);

// User order routes (list + create)
ordersRouter.post('/', auth(), jsonBody('50kb'), validate(createOrderSchema), createOrder);
ordersRouter.get('/', auth(), validate(orderListSchema), getOrders);

// Admin routes must come before /:id to avoid param collision
ordersRouter.get('/admin/all', auth('admin'), validate(adminOrderListSchema), adminGetOrders);
ordersRouter.put('/admin/:id/status', auth('admin'), jsonBody('10kb'), validate(adminUpdateStatusSchema), adminUpdateOrderStatus);

// Parameterised user routes
ordersRouter.get('/:id', auth(), validate(orderIdSchema), getOrder);
ordersRouter.put('/:id/cancel', auth(), validate(orderIdSchema), cancelOrder);
ordersRouter.put('/:id/return', auth(), jsonBody('5kb'), validate(orderIdSchema), requestReturn);
ordersRouter.get('/:id/invoice', auth(), validate(orderIdSchema), getOrderInvoice);

export default ordersRouter;

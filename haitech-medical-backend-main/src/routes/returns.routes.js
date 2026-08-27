import { Router } from 'express';
import { auth, validate, jsonBody } from '../middlewares/index.js';
import {
	createReturnRequest, getMyReturnRequests, getReturnStatus,
	adminGetReturnRequests, adminProcessReturn,
} from '../controllers/returns.controller.js';
import {
	returnRequestSchema,
	adminReturnSchema,
	orderIdSchema,
	returnListSchema,
	adminReturnListSchema,
} from '../validations/orders.validation.js';

const returnsRouter = Router();

// Customer routes
returnsRouter.post('/orders/:id/return', auth(), jsonBody('10kb'), validate(returnRequestSchema), createReturnRequest);
returnsRouter.get('/orders/:id/return', auth(), validate(orderIdSchema), getReturnStatus);
returnsRouter.get('/returns', auth(), validate(returnListSchema), getMyReturnRequests);

// Admin routes
returnsRouter.get('/admin/returns', auth('admin'), validate(adminReturnListSchema), adminGetReturnRequests);
returnsRouter.patch('/admin/returns/:returnId', auth('admin'), jsonBody('10kb'), validate(adminReturnSchema), adminProcessReturn);

export default returnsRouter;

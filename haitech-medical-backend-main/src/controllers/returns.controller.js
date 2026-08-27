// FILE: haitech-medical-backend-main/src/controllers/returns.controller.js
//
// Thin HTTP layer only — all business logic (eligibility checks, the
// return_requests <-> orders.status sync, transactions) lives in
// return.service.js. This controller previously queried the database
// directly with no service/repository layer at all; see return.service.js
// for the reconciled, single-source-of-truth implementation.
import { httpStatus } from '../constants/index.js';
import { returnService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

// ── Customer controllers ───────────────────────────────────────────────────────

export const createReturnRequest = catchAsync(async (req, res) => {
	const { returnRequest } = await returnService.requestReturn(req.user.id, req.params.id, req.body);
	return res.respond(httpStatus.CREATED, { returnRequest }, 'Return request submitted successfully');
});

export const getReturnStatus = catchAsync(async (req, res) => {
	const returnRequest = await returnService.getReturnStatus(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { returnRequest });
});

export const getMyReturnRequests = catchAsync(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const result = await returnService.getMyReturnRequests(req.user.id, { page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, { returnRequests: result.returnRequests }, undefined, result.meta);
});

// ── Admin controllers ──────────────────────────────────────────────────────────

export const adminGetReturnRequests = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, status } = req.query;
	const result = await returnService.adminGetReturnRequests({ page: Number(page), limit: Number(limit), status });
	return res.respond(httpStatus.OK, { returnRequests: result.returnRequests }, undefined, result.meta);
});

export const adminProcessReturn = catchAsync(async (req, res) => {
	const { returnId } = req.params;
	const { returnRequest } = await returnService.processReturn(req.user.id, returnId, req.body);
	return res.respond(httpStatus.OK, { returnRequest }, 'Return request updated');
});

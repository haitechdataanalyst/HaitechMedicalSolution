// FILE: haitech-medical-backend-main/src/controllers/returns.controller.js
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders, users, return_requests } from '../schema/index.js';
import { catchAsync } from '../utils/index.js';
import { httpStatus } from '../constants/index.js';
import ApiError from '../utils/errors/apiError.js';
import { logger } from '../config/index.js';

// ── helpers ────────────────────────────────────────────────────────────────────

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const parsePagination = (query) => {
	const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
	const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
	const offset = (page - 1) * limit;
	return { page, limit, offset };
};

// ── Customer controllers ───────────────────────────────────────────────────────

/**
 * POST /orders/:id/return
 * Submit a new return/refund request for a delivered order.
 */
export const createReturnRequest = catchAsync(async (req, res) => {
	const orderId = req.params.id;
	const userId = req.user.id;
	const { reason, description } = req.body;

	// 1. Verify order exists and belongs to the requesting user.
	const [order] = await db
		.select({ id: orders.id, status: orders.status, userId: orders.userId })
		.from(orders)
		.where(and(eq(orders.id, orderId), eq(orders.active, true)))
		.limit(1);

	if (!order) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
	}

	if (order.userId !== userId) {
		throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
	}

	// 2. Only delivered orders are eligible for a return.
	if (order.status !== 'delivered') {
		throw new ApiError(
			httpStatus.UNPROCESSABLE_ENTITY,
			`Return requests can only be made for delivered orders (current status: ${order.status})`
		);
	}

	// 3. Prevent duplicate pending return requests for the same order.
	const [existing] = await db
		.select({ id: return_requests.id, status: return_requests.status })
		.from(return_requests)
		.where(
			and(
				eq(return_requests.orderId, orderId),
				eq(return_requests.userId, userId),
				eq(return_requests.status, 'pending')
			)
		)
		.limit(1);

	if (existing) {
		throw new ApiError(
			httpStatus.CONFLICT,
			'A pending return request already exists for this order'
		);
	}

	// 4. Insert new return request.
	const [created] = await db
		.insert(return_requests)
		.values({
			orderId,
			userId,
			reason,
			description: description ?? null,
			status: 'pending',
		})
		.returning();

	return res.respond(httpStatus.CREATED, { returnRequest: created }, 'Return request submitted successfully');
});

/**
 * GET /orders/:id/return
 * Get the latest return request for a specific order (customer view).
 */
export const getReturnStatus = catchAsync(async (req, res) => {
	const orderId = req.params.id;
	const userId = req.user.id;

	// Confirm the order belongs to this user before exposing any return data.
	const [order] = await db
		.select({ id: orders.id, userId: orders.userId })
		.from(orders)
		.where(and(eq(orders.id, orderId), eq(orders.active, true)))
		.limit(1);

	if (!order) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
	}

	if (order.userId !== userId) {
		throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
	}

	const [returnRequest] = await db
		.select()
		.from(return_requests)
		.where(and(eq(return_requests.orderId, orderId), eq(return_requests.userId, userId)))
		.orderBy(desc(return_requests.createdAt))
		.limit(1);

	if (!returnRequest) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No return request found for this order');
	}

	return res.respond(httpStatus.OK, { returnRequest });
});

/**
 * GET /returns
 * Paginated list of all return requests made by the authenticated customer.
 */
export const getMyReturnRequests = catchAsync(async (req, res) => {
	const userId = req.user.id;
	const { page, limit, offset } = parsePagination(req.query);

	const rows = await db
		.select({
			id: return_requests.id,
			orderId: return_requests.orderId,
			reason: return_requests.reason,
			description: return_requests.description,
			status: return_requests.status,
			adminNotes: return_requests.adminNotes,
			refundAmount: return_requests.refundAmount,
			processedAt: return_requests.processedAt,
			createdAt: return_requests.createdAt,
			updatedAt: return_requests.updatedAt,
		})
		.from(return_requests)
		.where(eq(return_requests.userId, userId))
		.orderBy(desc(return_requests.createdAt))
		.limit(limit)
		.offset(offset);

	// Lightweight count query for pagination meta.
	const countRows = await db
		.select({ count: return_requests.id })
		.from(return_requests)
		.where(eq(return_requests.userId, userId));

	const total = countRows.length;

	return res.respond(
		httpStatus.OK,
		{ returnRequests: rows },
		undefined,
		{ page, limit, total, totalPages: Math.ceil(total / limit) }
	);
});

// ── Admin controllers ──────────────────────────────────────────────────────────

/**
 * GET /admin/returns
 * Paginated list of all return requests with optional status filter.
 * Includes order summary and customer info.
 */
export const adminGetReturnRequests = catchAsync(async (req, res) => {
	const { page, limit, offset } = parsePagination(req.query);
	const { status } = req.query;

	const conditions = [];
	if (status) {
		conditions.push(eq(return_requests.status, status));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const rows = await db
		.select({
			id: return_requests.id,
			orderId: return_requests.orderId,
			userId: return_requests.userId,
			reason: return_requests.reason,
			description: return_requests.description,
			status: return_requests.status,
			adminNotes: return_requests.adminNotes,
			refundAmount: return_requests.refundAmount,
			processedBy: return_requests.processedBy,
			processedAt: return_requests.processedAt,
			createdAt: return_requests.createdAt,
			updatedAt: return_requests.updatedAt,
			// Order summary
			orderStatus: orders.status,
			orderTotal: orders.total,
			// Customer info
			userFirstName: users.firstName,
			userLastName: users.lastName,
			userEmail: users.email,
		})
		.from(return_requests)
		.leftJoin(orders, eq(return_requests.orderId, orders.id))
		.leftJoin(users, eq(return_requests.userId, users.id))
		.where(whereClause)
		.orderBy(desc(return_requests.createdAt))
		.limit(limit)
		.offset(offset);

	// Count with the same filter for accurate pagination.
	const countQuery = db
		.select({ count: return_requests.id })
		.from(return_requests);

	const countRows = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	const total = countRows.length;

	return res.respond(
		httpStatus.OK,
		{ returnRequests: rows },
		undefined,
		{ page, limit, total, totalPages: Math.ceil(total / limit) }
	);
});

/**
 * PATCH /admin/returns/:returnId
 * Approve, reject, or mark a return request as completed.
 * Optionally records a refund amount and admin notes.
 * Actual Razorpay refund disbursement is deferred (TBD).
 */
export const adminProcessReturn = catchAsync(async (req, res) => {
	const { returnId } = req.params;
	const adminId = req.user.id;
	const { status, adminNotes, refundAmount } = req.body;

	// Confirm the return request exists.
	const [existing] = await db
		.select({ id: return_requests.id, status: return_requests.status })
		.from(return_requests)
		.where(eq(return_requests.id, returnId))
		.limit(1);

	if (!existing) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Return request not found');
	}

	// Build update payload.
	const updateValues = {
		status,
		adminNotes: adminNotes ?? null,
		processedBy: adminId,
		processedAt: new Date(),
		updatedAt: new Date(),
	};

	if (refundAmount !== undefined && refundAmount !== null) {
		updateValues.refundAmount = refundAmount;
	}

	const [updated] = await db
		.update(return_requests)
		.set(updateValues)
		.where(eq(return_requests.id, returnId))
		.returning();

	// Log refund intent when approved with a refund amount — actual Razorpay
	// refund initiation is handled separately (TBD).
	if (status === 'approved' && updated.refundAmount) {
		logger.info(
			`[Returns] Refund intent logged — returnId=${returnId} ` +
			`orderId=${updated.orderId} amount=${updated.refundAmount} paise ` +
			`processedBy=${adminId}`
		);
	}

	return res.respond(httpStatus.OK, { returnRequest: updated }, 'Return request updated');
});

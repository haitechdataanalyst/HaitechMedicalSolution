import { db } from '../config/index.js';
import { returnRepository, orderRepository } from '../repositories/index.js';
import { notFoundError, badRequestError, conflictError } from '../utils/index.js';
import { withRetryableTransaction } from '../utils/db/drizzle.utils.js';
import { assertValidTransition } from './order.service.js';

// This is now the ONE authoritative implementation of "request/process a
// return" — both PUT /orders/:id/return (orders.controller.js) and
// POST /returns/orders/:id/return (returns.controller.js) call into it.
// See order.service.js's removed `requestReturn` for why this consolidation
// happened.

const RETURN_STATUSES = ['approved', 'rejected', 'completed'];

// How an admin's return decision maps onto the order's own status, so
// orders.status never drifts from the return's real outcome. 'approved'
// intentionally leaves the order at 'return_requested' (still in progress) —
// only a terminal decision moves the order. Pure lookup table, no DI needed.
export const ORDER_STATUS_FOR_RETURN_DECISION = {
	rejected: 'delivered',
	completed: 'returned',
};

// ── Lightweight DI ────────────────────────────────────────────────────────────
// Same pattern as order.service.js's createOrderService: inject repositories
// and the transaction runner so the branching business logic here (duplicate
// pending-request guard, status-mapping, invalid-status guard) can be unit
// tested with fake repos instead of a real DB.
export const createReturnService = ({
	returnRepository: returnRepo = returnRepository,
	orderRepository: orderRepo = orderRepository,
	runTransaction = (cb) => withRetryableTransaction(db, cb),
} = {}) => {
	const requestReturn = async (userId, orderId, { reason, description } = {}) => {
		const order = await orderRepo.findByIdAndUser(orderId, userId);
		if (!order) throw notFoundError('Order not found');

		// Single source of truth for the order state machine — order.service.js.
		assertValidTransition(order.status, 'return_requested');

		const existingPending = await returnRepo.findPendingByOrderAndUser(orderId, userId);
		if (existingPending) throw conflictError('A pending return request already exists for this order');

		return runTransaction(async (tx) => {
			const returnRequest = await returnRepo.create({ orderId, userId, reason, description }, tx);
			const updatedOrder = await orderRepo.updateStatus(orderId, userId, 'return_requested', tx);
			return { returnRequest, order: updatedOrder };
		});
	};

	const getReturnStatus = async (userId, orderId) => {
		const order = await orderRepo.findByIdAndUser(orderId, userId);
		if (!order) throw notFoundError('Order not found');

		const returnRequest = await returnRepo.findLatestByOrderAndUser(orderId, userId);
		if (!returnRequest) throw notFoundError('No return request found for this order');

		return returnRequest;
	};

	const getMyReturnRequests = async (userId, { page = 1, limit = 10 } = {}) => {
		const offset = (page - 1) * limit;
		const { rows, total } = await returnRepo.findManyByUser(userId, { limit, offset });
		return { returnRequests: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
	};

	const adminGetReturnRequests = async ({ page = 1, limit = 20, status } = {}) => {
		const offset = (page - 1) * limit;
		const { rows, total } = await returnRepo.findManyAdmin({ status, limit, offset });
		return { returnRequests: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
	};

	const processReturn = async (adminId, returnId, { status, adminNotes, refundAmount } = {}) => {
		if (!RETURN_STATUSES.includes(status)) {
			throw badRequestError(`Invalid return status: ${status}`);
		}

		const existing = await returnRepo.findById(returnId);
		if (!existing) throw notFoundError('Return request not found');

		return runTransaction(async (tx) => {
			const updates = {
				status,
				adminNotes: adminNotes ?? null,
				processedBy: adminId,
				processedAt: new Date(),
				updatedAt: new Date(),
			};
			if (refundAmount !== undefined && refundAmount !== null) {
				updates.refundAmount = refundAmount;
			}

			const returnRequest = await returnRepo.update(returnId, updates, tx);

			// Sync orders.status to a terminal decision. This intentionally does
			// NOT go through assertValidTransition: return_requests rows created
			// before this reconciliation (via the old, now-removed order-status-only
			// path) may not have moved the order to 'return_requested' at all, and
			// an admin's explicit, authorized decision on a return should always be
			// able to finalize the order rather than being blocked by that mismatch.
			const nextOrderStatus = ORDER_STATUS_FOR_RETURN_DECISION[status];
			const order = nextOrderStatus
				? await orderRepo.updateStatus(existing.orderId, adminId, nextOrderStatus, tx)
				: null;

			return { returnRequest, order };
		});
	};

	return {
		requestReturn,
		getReturnStatus,
		getMyReturnRequests,
		adminGetReturnRequests,
		processReturn,
	};
};

const defaultReturnService = createReturnService();

export const { requestReturn, getReturnStatus, getMyReturnRequests, adminGetReturnRequests, processReturn } =
	defaultReturnService;

const returnService = {
	...defaultReturnService,
	ORDER_STATUS_FOR_RETURN_DECISION,
	createReturnService,
};
export default returnService;

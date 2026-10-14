import { leadRepository } from '../repositories/index.js';
import { tooManyRequestsError, notFoundError } from '../utils/index.js';

// Matches the equivalent window/threshold the in-memory Map used to enforce
// per flow (5 requests / 60s), now checked against persisted rows so it
// survives redeploys instead of resetting.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const assertNotRateLimited = async (email, ipAddress) => {
	const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
	const count = await leadRepository.countRecentByEmailOrIp(email, ipAddress, since);
	if (count >= RATE_LIMIT_MAX_REQUESTS) {
		throw tooManyRequestsError('Too many requests. Please wait a minute before trying again.');
	}
};

export const createLead = async (data) => {
	await assertNotRateLimited(data.email, data.ipAddress);
	return leadRepository.create(data);
};

export const markEmailSent = async (id) => {
	const lead = await leadRepository.markEmailSent(id);
	if (!lead) throw notFoundError('Lead not found');
	return lead;
};

const leadService = { createLead, markEmailSent };
export default leadService;

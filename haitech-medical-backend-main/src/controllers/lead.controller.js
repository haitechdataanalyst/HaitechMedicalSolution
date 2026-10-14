import { httpStatus } from '../constants/index.js';
import { leadService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

// ipAddress comes from req.ip (respects app.set('trust proxy', 1) — see
// app.js), never from the request body, so it can't be spoofed to bypass
// the DB-backed rate limit.
export const createLead = catchAsync(async (req, res) => {
	const lead = await leadService.createLead({ ...req.body, ipAddress: req.ip });
	return res.respond(httpStatus.CREATED, { lead }, 'Lead recorded');
});

export const markEmailSent = catchAsync(async (req, res) => {
	const lead = await leadService.markEmailSent(req.params.id);
	return res.respond(httpStatus.OK, { lead }, 'Lead updated');
});

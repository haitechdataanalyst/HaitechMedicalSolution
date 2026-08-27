// FILE: haitech-medical-backend-main/src/controllers/admin-revenue.controller.js
// Split out of the former admin.controller.js God file. Thin HTTP layer only.
import { httpStatus } from '../constants/index.js';
import { revenueService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminGetRevenue = catchAsync(async (req, res) => {
	const revenue = await revenueService.adminGetRevenue();
	return res.respond(httpStatus.OK, revenue);
});

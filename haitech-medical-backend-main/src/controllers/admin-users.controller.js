// FILE: haitech-medical-backend-main/src/controllers/admin-users.controller.js
// Split out of the former admin.controller.js God file. Thin HTTP layer only.
import { httpStatus } from '../constants/index.js';
import { userService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminGetAllUsers = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, search } = req.query;
	const result = await userService.adminListUsers({ page: Number(page), limit: Number(limit), search });
	return res.respond(httpStatus.OK, { users: result.users }, undefined, result.meta);
});

export const adminToggleUserStatus = catchAsync(async (req, res) => {
	const user = await userService.adminToggleUserStatus(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { user }, `User ${user.active ? 'activated' : 'deactivated'} successfully`);
});

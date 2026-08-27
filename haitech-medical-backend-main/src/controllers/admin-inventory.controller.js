// FILE: haitech-medical-backend-main/src/controllers/admin-inventory.controller.js
// Split out of the former admin.controller.js God file. Thin HTTP layer only.
import { httpStatus } from '../constants/index.js';
import { inventoryService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminGetInventory = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, search } = req.query;
	const result = await inventoryService.adminListInventory({ page: Number(page), limit: Number(limit), search });
	return res.respond(httpStatus.OK, { inventory: result.inventory }, undefined, result.meta);
});

export const adminUpdateInventory = catchAsync(async (req, res) => {
	const productId = Number(req.params.productId);
	const inventory = await inventoryService.adminUpdateInventory(productId, req.body);
	return res.respond(httpStatus.OK, { inventory }, 'Inventory updated');
});

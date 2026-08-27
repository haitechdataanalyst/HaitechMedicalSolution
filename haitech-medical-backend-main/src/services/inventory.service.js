import { inventoryRepository } from '../repositories/index.js';
import { notFoundError, badRequestError } from '../utils/index.js';

// NOTE: this covers the internal product_inventory table (stock levels for
// the site's own products) only. It is intentionally NOT reconciled with the
// separate Zoho-sync-based inventory integration (src/services/zoho.service.js,
// src/routes/inventory.routes.js) in this pass — see
// [[feedback_architecture_policy]] Phase 5/inventory-architecture notes.
// Determining which system is authoritative for which responsibility is its
// own decision and out of scope for splitting admin.controller.js.

export const adminListInventory = async ({ page = 1, limit = 20, search } = {}) => {
	const offset = (page - 1) * limit;
	const { rows, total } = await inventoryRepository.findManyWithProducts({ search, limit, offset });
	return { inventory: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

export const adminUpdateInventory = async (productId, { quantity, reservedQuantity } = {}) => {
	if ((quantity === null || quantity === undefined) && (reservedQuantity === null || reservedQuantity === undefined)) {
		throw badRequestError('Provide at least one of: quantity, reservedQuantity');
	}

	const product = await inventoryRepository.findProductById(productId);
	if (!product) throw notFoundError('Product not found');

	return inventoryRepository.upsert({ productId, quantity, reservedQuantity });
};

const inventoryService = { adminListInventory, adminUpdateInventory };
export default inventoryService;

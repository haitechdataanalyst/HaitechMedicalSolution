import { httpStatus } from '../constants/index.js';
import { zohoService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';
import { logger } from '../config/index.js';

// GET /api/v1/inventory/items?page=1&perPage=24&search=&category=&inStock=true
export const listItems = catchAsync(async (req, res) => {
	const forceRefresh = req.query.refresh === 'true';
	const allItems = await zohoService.getInventoryItems({ forceRefresh });

	// ── Filtering ──────────────────────────────────────────────────────────────
	const { search, category, inStock } = req.query;
	let filtered = allItems;

	if (search) {
		const q = search.toLowerCase();
		filtered = filtered.filter(
			(i) =>
				i.name?.toLowerCase().includes(q) ||
				i.sku?.toLowerCase().includes(q) ||
				i.description?.toLowerCase().includes(q),
		);
	}
	if (category) {
		filtered = filtered.filter((i) => i.category?.toLowerCase() === category.toLowerCase());
	}
	if (inStock === 'true') {
		filtered = filtered.filter((i) => i.availableForSale > 0);
	}

	// ── Pagination ─────────────────────────────────────────────────────────────
	const page    = Math.max(1, parseInt(req.query.page   ?? '1',  10) || 1);
	const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage ?? '24', 10) || 24));
	const total   = filtered.length;
	const totalPages = Math.ceil(total / perPage);
	const offset  = (page - 1) * perPage;
	const items   = filtered.slice(offset, offset + perPage);

	// ── Unique categories (from full unfiltered list for the filter dropdown) ──
	const categories = Array.from(
		new Set(allItems.map((i) => i.category).filter(Boolean))
	).sort();

	return res.respond(httpStatus.OK, {
		items,
		pagination: { page, perPage, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
		categories,
		cachedAt: new Date().toISOString(),
	}, 'Inventory items fetched');
});

// GET /api/v1/inventory/items/:itemId
export const getItem = catchAsync(async (req, res) => {
	const item = await zohoService.getInventoryItem(req.params.itemId);
	return res.respond(httpStatus.OK, { item }, 'Inventory item fetched');
});

// POST /api/v1/inventory/sync  (admin only — force cache bust)
export const syncInventory = catchAsync(async (req, res) => {
	const items = await zohoService.getInventoryItems({ forceRefresh: true });
	return res.respond(httpStatus.OK, { synced: items.length, syncedAt: new Date().toISOString() }, 'Inventory synced from Zoho');
});

// POST /api/v1/inventory/webhook  (called by Zoho when stock changes)
export const handleWebhook = catchAsync(async (req, res) => {
	const payload = req.body;
	logger.info('[Zoho Webhook]', JSON.stringify(payload).slice(0, 300));
	await zohoService.invalidateItemsCache();
	return res.respond(httpStatus.OK, null, 'Webhook received');
});

import { env } from '../config/index.js';
import { getRedisClient, isRedisConnected } from '../config/redis.js';
import { logger } from '../config/index.js';
import { internalError, badRequestError } from '../utils/index.js';

// ── Redis cache keys ───────────────────────────────────────────────────────────
const TOKEN_KEY = 'zoho:access_token';
const ITEMS_KEY = 'zoho:inventory:items';
const ITEMS_TTL = 300;   // cache inventory for 5 minutes
const TOKEN_TTL = 3300;  // Zoho tokens last 1 hour; refresh at 55 min

// ── Token management ──────────────────────────────────────────────────────────

const fetchNewAccessToken = async () => {
	const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, ACCOUNTS_URL } = env.ZOHO;

	if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
		throw internalError('Zoho credentials not configured (ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN)');
	}

	if (REFRESH_TOKEN === 'REPLACE_WITH_REAL_REFRESH_TOKEN') {
		throw internalError('Zoho refresh token not set — see setup guide to generate one');
	}

	const params = new URLSearchParams({
		grant_type: 'refresh_token',
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		refresh_token: REFRESH_TOKEN,
	});

	const res = await fetch(`${ACCOUNTS_URL}/oauth/v2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params.toString(),
	});

	const data = await res.json();

	if (!data.access_token) {
		logger.error('[Zoho] Token refresh failed:', data);
		throw internalError(`Zoho token refresh failed: ${data.error || 'unknown error'}`);
	}

	// Cache the new token in Redis
	if (isRedisConnected()) {
		try {
			const redis = getRedisClient();
			await redis.set(TOKEN_KEY, data.access_token, { EX: TOKEN_TTL });
		} catch (e) {
			logger.warn('[Zoho] Failed to cache access token in Redis:', e.message);
		}
	}

	logger.info('[Zoho] Access token refreshed successfully');
	return data.access_token;
};

// Returns a valid access token — from Redis cache or freshly refreshed
export const getAccessToken = async () => {
	if (isRedisConnected()) {
		try {
			const redis = getRedisClient();
			const cached = await redis.get(TOKEN_KEY);
			if (cached) return cached;
		} catch (e) {
			logger.warn('[Zoho] Redis read failed, fetching fresh token:', e.message);
		}
	}
	return fetchNewAccessToken();
};

// ── Generic Zoho API request helper ──────────────────────────────────────────

const zohoFetch = async (path, options = {}) => {
	const token = await getAccessToken();
	const { API_BASE, ORG_ID } = env.ZOHO;

	const url = new URL(`${API_BASE}${path}`);
	if (!url.searchParams.has('organization_id')) {
		url.searchParams.set('organization_id', ORG_ID);
	}

	const res = await fetch(url.toString(), {
		...options,
		headers: {
			Authorization: `Zoho-oauthtoken ${token}`,
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	// If 401, try once with a fresh token (handles edge-case expiry)
	if (res.status === 401) {
		logger.warn('[Zoho] Got 401 — refreshing token and retrying');
		if (isRedisConnected()) {
			try { await getRedisClient().del(TOKEN_KEY); } catch {}
		}
		const freshToken = await fetchNewAccessToken();
		const retryRes = await fetch(url.toString(), {
			...options,
			headers: {
				Authorization: `Zoho-oauthtoken ${freshToken}`,
				'Content-Type': 'application/json',
				...options.headers,
			},
		});
		if (!retryRes.ok) {
			const body = await retryRes.text();
			throw internalError(`Zoho API error ${retryRes.status}: ${body.slice(0, 200)}`);
		}
		return retryRes.json();
	}

	if (!res.ok) {
		const body = await res.text();
		throw internalError(`Zoho API error ${res.status}: ${body.slice(0, 200)}`);
	}

	return res.json();
};

// ── Inventory items ───────────────────────────────────────────────────────────

const normaliseItem = (item) => ({
	id: item.item_id,
	name: item.name,
	sku: item.sku || null,
	description: item.description || null,
	status: item.status,                          // 'active' | 'inactive'
	itemType: item.item_type,                     // 'inventory' | 'service' | 'non_inventory'
	unit: item.unit || null,
	rate: item.rate ?? 0,                         // selling price
	purchaseRate: item.purchase_rate ?? null,
	currency: item.currency_code || 'INR',
	stockOnHand: item.actual_available_stock ?? 0,
	committedStock: item.actual_committed_stock ?? 0,
	availableForSale: item.actual_available_for_sale_stock ?? item.actual_available_stock ?? 0,
	reorderLevel: item.reorder_level ?? null,
	image: item.image_document_id ? `https://inventory.zoho.com/api/v1/items/${item.item_id}/image?organization_id=${env.ZOHO.ORG_ID}` : null,
	category: item.category_name || null,
	brand: item.brand || null,
	taxName: item.tax_name || null,
	taxRate: item.tax_percentage ?? null,
	hsn: item.hsn_or_sac || null,
	lastModified: item.last_modified_time || null,
});

// Fetch a single page of items from Zoho
const fetchItemPage = async (page = 1, perPage = 200) => {
	const data = await zohoFetch(`/items?page=${page}&per_page=${perPage}&sort_column=last_modified_time&sort_order=D`);
	return {
		items: (data.items || []).map(normaliseItem),
		hasMorePages: data.page_context?.has_more_page ?? false,
		currentPage: data.page_context?.page ?? page,
	};
};

// Fetch ALL items across all pages
const fetchAllItems = async () => {
	const all = [];
	let page = 1;

	while (true) {
		const { items, hasMorePages } = await fetchItemPage(page);
		all.push(...items);
		if (!hasMorePages) break;
		page++;
	}

	logger.info(`[Zoho] Fetched ${all.length} inventory items`);
	return all;
};

// Public: get all items — Redis-cached for ITEMS_TTL seconds
export const getInventoryItems = async ({ forceRefresh = false } = {}) => {
	// Try Redis cache first
	if (!forceRefresh && isRedisConnected()) {
		try {
			const redis = getRedisClient();
			const cached = await redis.get(ITEMS_KEY);
			if (cached) return JSON.parse(cached);
		} catch (e) {
			logger.warn('[Zoho] Cache read failed:', e.message);
		}
	}

	const items = await fetchAllItems();

	// Write to cache
	if (isRedisConnected()) {
		try {
			const redis = getRedisClient();
			await redis.set(ITEMS_KEY, JSON.stringify(items), { EX: ITEMS_TTL });
		} catch (e) {
			logger.warn('[Zoho] Cache write failed:', e.message);
		}
	}

	return items;
};

// Get a single item by ID
export const getInventoryItem = async (itemId) => {
	const data = await zohoFetch(`/items/${itemId}`);
	if (!data.item) throw badRequestError('Item not found in Zoho Inventory');
	return normaliseItem(data.item);
};

// ── Webhook: Zoho → backend ───────────────────────────────────────────────────
// When Zoho fires an inventory change event, invalidate the cache so the next
// request fetches fresh data.
export const invalidateItemsCache = async () => {
	if (isRedisConnected()) {
		try {
			await getRedisClient().del(ITEMS_KEY);
			logger.info('[Zoho] Inventory cache invalidated via webhook');
		} catch (e) {
			logger.warn('[Zoho] Cache invalidation failed:', e.message);
		}
	}
};

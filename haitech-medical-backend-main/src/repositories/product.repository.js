import { eq, and, ilike, gte, lte, or, desc, asc, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { products, categories, brands } from '../schema/index.js';

const isPresent = (v) => v !== null && v !== undefined;

const parseJson = (str) => {
	if (!str) return null;
	try { return JSON.parse(str); } catch { return null; }
};

const hydrate = (row) => {
	if (!row) return null;
	return {
		...row,
		contentBlocks:   parseJson(row.contentBlocks),
		relatedProducts: parseJson(row.relatedProducts),
		frameVariants:   parseJson(row.frameVariants),
	};
};

// ── List with filters + pagination ────────────────────────────────────────────

export const findMany = async ({ search, categoryId, brandId, hasVariants, minPrice, maxPrice, currency, sort = 'order', page = 1, limit = 20 } = {}) => {
	const conditions = [eq(products.active, true)];

	if (isPresent(categoryId)) conditions.push(eq(products.categoryId, Number(categoryId)));
	if (isPresent(brandId))    conditions.push(eq(products.brandId, Number(brandId)));
	if (hasVariants === 'true' || hasVariants === true) conditions.push(eq(products.hasVariants, true));
	if (currency)              conditions.push(eq(products.currency, currency.toUpperCase()));
	if (isPresent(minPrice))   conditions.push(gte(products.basePrice, Number(minPrice)));
	if (isPresent(maxPrice))   conditions.push(lte(products.basePrice, Number(maxPrice)));

	if (search) {
		const q = `%${search}%`;
		conditions.push(or(
			ilike(products.name, q),
			ilike(products.description, q),
			ilike(products.sku, q),
		));
	}

	const where = and(...conditions);

	let orderBy;
	if (sort === 'price_asc')  orderBy = asc(products.basePrice);
	else if (sort === 'price_desc') orderBy = desc(products.basePrice);
	else if (sort === 'name_asc')   orderBy = asc(products.name);
	else if (sort === 'name_desc')  orderBy = desc(products.name);
	else orderBy = asc(products.sortOrder);

	const offset = (Number(page) - 1) * Number(limit);

	const [rows, countRow] = await Promise.all([
		db.select().from(products).where(where).orderBy(orderBy).limit(Number(limit)).offset(offset),
		db.select({ count: sql`count(*)::int` }).from(products).where(where),
	]);

	const total = countRow[0]?.count ?? 0;

	return {
		items: rows.map(hydrate),
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

// ── Single product by ID or slug ──────────────────────────────────────────────

export const findById = async (id) => {
	const asNum = Number(id);
	const [row] = await db.select().from(products)
		.where(
			and(
				eq(products.active, true),
				isNaN(asNum) ? eq(products.slug, String(id)) : eq(products.id, asNum),
			)
		)
		.limit(1);
	return hydrate(row ?? null);
};

export const findBySlug = async (slug) => {
	const [row] = await db.select().from(products)
		.where(and(eq(products.slug, slug), eq(products.active, true)))
		.limit(1);
	return hydrate(row ?? null);
};

// ── Categories ────────────────────────────────────────────────────────────────

export const findAllCategories = async () => {
	return db.select().from(categories).where(eq(categories.active, true)).orderBy(asc(categories.sortOrder));
};

export const findCategoryById = async (id) => {
	const [row] = await db.select().from(categories)
		.where(and(eq(categories.id, Number(id)), eq(categories.active, true)))
		.limit(1);
	return row ?? null;
};

// ── Brands ────────────────────────────────────────────────────────────────────

export const findAllBrands = async () => {
	const rows = await db.select({
		id: brands.id,
		slug: brands.slug,
		name: brands.name,
		description: brands.description,
		image: brands.image,
		sortOrder: brands.sortOrder,
		productCount: sql`(select count(*)::int from products where brand_id = brands.id and active = true)`,
	}).from(brands).where(eq(brands.active, true)).orderBy(asc(brands.sortOrder));
	return rows;
};

// ── Advanced search with relevance scoring ────────────────────────────────────

export const searchAdvanced = async ({ q = '', filters = {}, sort = 'relevance', page = 1, limit = 20 } = {}) => {
	const conditions = [eq(products.active, true)];

	if (isPresent(filters.categoryId)) conditions.push(eq(products.categoryId, Number(filters.categoryId)));
	if (isPresent(filters.brandId))    conditions.push(eq(products.brandId, Number(filters.brandId)));
	if (filters.currency)              conditions.push(eq(products.currency, filters.currency.toUpperCase()));
	if (isPresent(filters.minPrice))   conditions.push(gte(products.basePrice, Number(filters.minPrice)));
	if (isPresent(filters.maxPrice))   conditions.push(lte(products.basePrice, Number(filters.maxPrice)));
	if (filters.hasVariants === 'true' || filters.hasVariants === true) {
		conditions.push(eq(products.hasVariants, true));
	}

	if (q) {
		const term = `%${q}%`;
		conditions.push(or(
			ilike(products.name, term),
			ilike(products.description, term),
			ilike(products.sku, term),
		));
	}

	const where = and(...conditions);

	let orderBy;
	if (sort === 'price_asc')       orderBy = asc(products.basePrice);
	else if (sort === 'price_desc') orderBy = desc(products.basePrice);
	else if (sort === 'name_asc')   orderBy = asc(products.name);
	else if (sort === 'name_desc')  orderBy = desc(products.name);
	else                            orderBy = asc(products.sortOrder);

	const offset = (Number(page) - 1) * Number(limit);
	const [rows, countRow] = await Promise.all([
		db.select().from(products).where(where).orderBy(orderBy).limit(Number(limit)).offset(offset),
		db.select({ count: sql`count(*)::int` }).from(products).where(where),
	]);

	const total = countRow[0]?.count ?? 0;

	return {
		items: rows.map(hydrate),
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1, sort },
	};
};

// ── Compare products ──────────────────────────────────────────────────────────

export const findByIds = async (ids) => {
	const rows = await db.select().from(products)
		.where(and(
			eq(products.active, true),
			sql`${products.id} = ANY(ARRAY[${sql.raw(ids.map(Number).join(','))}]::int[])`,
		));
	return rows.map(hydrate);
};

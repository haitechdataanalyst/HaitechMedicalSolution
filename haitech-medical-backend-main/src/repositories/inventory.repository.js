import { and, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { products, productInventory } from '../schema/index.js';

// Admin inventory listing: products LEFT JOIN product_inventory. Previously
// this ran as two entirely separate code paths in admin.controller.js — a
// raw db.execute() SQL string for the "table exists" case, and a second,
// differently-shaped Drizzle query for the "table doesn't exist" fallback
// (product_inventory is now a declared schema table as of Phase 1, so the
// fallback branch is no longer needed at all).
export const findManyWithProducts = async ({ search, limit = 20, offset = 0 } = {}) => {
	const conditions = [eq(products.active, true)];
	if (search) {
		const q = `%${search}%`;
		conditions.push(or(ilike(products.name, q), ilike(products.sku, q)));
	}
	const where = and(...conditions);

	const columns = {
		productId: products.id,
		productName: products.name,
		productSku: products.sku,
		basePrice: products.basePrice,
		productActive: products.active,
		quantity: sql`COALESCE(${productInventory.quantity}, 0)`,
		reservedQuantity: sql`COALESCE(${productInventory.reservedQuantity}, 0)`,
		availableQuantity: sql`COALESCE(${productInventory.quantity}, 0) - COALESCE(${productInventory.reservedQuantity}, 0)`,
	};

	const [rows, [countRow]] = await Promise.all([
		db
			.select(columns)
			.from(products)
			.leftJoin(productInventory, eq(productInventory.productId, products.id))
			.where(where)
			.orderBy(asc(products.sortOrder))
			.limit(limit)
			.offset(offset),
		db.select({ count: sql`count(*)::int` }).from(products).where(where),
	]);

	return { rows, total: countRow?.count ?? 0 };
};

export const findProductById = async (productId) => {
	const [row] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
	return row || null;
};

// Upsert via Drizzle's typed onConflictDoUpdate instead of a hand-built
// `sql.raw(updateClause)` string — same partial-update semantics (only the
// fields actually provided are changed on conflict).
export const upsert = async ({ productId, quantity, reservedQuantity }) => {
	const set = { updatedAt: new Date() };
	if (quantity !== undefined) set.quantity = quantity;
	if (reservedQuantity !== undefined) set.reservedQuantity = reservedQuantity;

	const [row] = await db
		.insert(productInventory)
		.values({
			productId,
			quantity: quantity ?? 0,
			reservedQuantity: reservedQuantity ?? 0,
		})
		.onConflictDoUpdate({ target: productInventory.productId, set })
		.returning();

	return row;
};

import { and, eq } from 'drizzle-orm';
import { db } from '../config/index.js';
import { wishlists } from '../schema/index.js';

export const findByUser = async (userId) => {
	return db.select().from(wishlists).where(eq(wishlists.userId, userId));
};

export const add = async (userId, productId) => {
	const [existing] = await db
		.select()
		.from(wishlists)
		.where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
		.limit(1);

	if (existing) return existing;

	const [created] = await db.insert(wishlists).values({ userId, productId }).returning();
	return created;
};

export const remove = async (userId, productId) => {
	await db.delete(wishlists).where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));
};

export const wishlistRepository = { findByUser, add, remove };
export default wishlistRepository;

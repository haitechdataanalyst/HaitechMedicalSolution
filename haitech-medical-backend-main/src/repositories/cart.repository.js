import { and, eq } from 'drizzle-orm';
import { db } from '../config/index.js';
import { cartSessions, cartItems } from '../schema/index.js';

export const getOrCreate = async (userId) => {
	const [existing] = await db.select().from(cartSessions).where(eq(cartSessions.userId, userId)).limit(1);
	if (existing) return existing;

	const [created] = await db.insert(cartSessions).values({ userId }).returning();
	return created;
};

export const getWithItems = async (userId) => {
	const cart = await getOrCreate(userId);
	const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
	return { ...cart, items };
};

export const upsertItem = async (cartId, item) => {
	const { productId, productName, productSku, quantity, unitPrice, customization } = item;

	// Find existing item with same productId + customization
	const [existing] = await db
		.select()
		.from(cartItems)
		.where(and(
			eq(cartItems.cartId, cartId),
			eq(cartItems.productId, productId)
		))
		.limit(1);

	if (existing) {
		const [updated] = await db
			.update(cartItems)
			.set({ quantity: existing.quantity + (quantity ?? 1), updatedAt: new Date() })
			.where(eq(cartItems.id, existing.id))
			.returning();
		return updated;
	}

	const [created] = await db
		.insert(cartItems)
		.values({ cartId, productId, productName, productSku, quantity: quantity ?? 1, unitPrice: unitPrice ?? 0, customization: customization ?? null })
		.returning();
	return created;
};

export const setItemQuantity = async (cartId, itemId, quantity) => {
	if (quantity <= 0) {
		await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
		return null;
	}
	const [updated] = await db
		.update(cartItems)
		.set({ quantity, updatedAt: new Date() })
		.where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)))
		.returning();
	return updated || null;
};

export const deleteItem = async (cartId, itemId) => {
	await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
};

export const clearItems = async (cartId) => {
	await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
};

export const mergeItems = async (cartId, items) => {
	for (const item of items) {
		await upsertItem(cartId, item);
	}
};

export const cartRepository = { getOrCreate, getWithItems, upsertItem, setItemQuantity, deleteItem, clearItems, mergeItems };
export default cartRepository;

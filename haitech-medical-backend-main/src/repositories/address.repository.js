import { and, desc, eq } from 'drizzle-orm';
import { db } from '../config/index.js';
import { userAddresses } from '../schema/index.js';

export const findByUserId = async (userId) => {
	return db
		.select()
		.from(userAddresses)
		.where(and(eq(userAddresses.userId, userId), eq(userAddresses.active, true)))
		.orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));
};

// `conn` may be an active Drizzle transaction (tx) or omitted to use the
// default db pool. Passing a tx here allows callers to read the address row
// within the same atomic transaction as the order creation.
export const findById = async (id, conn = db) => {
	const [address] = await conn
		.select()
		.from(userAddresses)
		.where(and(eq(userAddresses.id, id), eq(userAddresses.active, true)))
		.limit(1);
	return address || null;
};

export const findByIdAndUser = async (id, userId) => {
	const [address] = await db
		.select()
		.from(userAddresses)
		.where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId), eq(userAddresses.active, true)))
		.limit(1);
	return address || null;
};

export const create = async (userId, data) => {
	return db.transaction(async (tx) => {
		if (data.isDefault) {
			await tx
				.update(userAddresses)
				.set({ isDefault: false, modifiedAt: new Date() })
				.where(and(eq(userAddresses.userId, userId), eq(userAddresses.isDefault, true)));
		}

		const [address] = await tx
			.insert(userAddresses)
			.values({ ...data, userId, createdBy: userId, modifiedBy: userId })
			.returning();

		return address;
	});
};

export const update = async (id, userId, data) => {
	return db.transaction(async (tx) => {
		if (data.isDefault) {
			await tx
				.update(userAddresses)
				.set({ isDefault: false, modifiedAt: new Date() })
				.where(and(eq(userAddresses.userId, userId), eq(userAddresses.isDefault, true)));
		}

		const [address] = await tx
			.update(userAddresses)
			.set({ ...data, modifiedAt: new Date(), modifiedBy: userId })
			.where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId), eq(userAddresses.active, true)))
			.returning();

		return address || null;
	});
};

export const softDelete = async (id, userId) => {
	const [deleted] = await db
		.update(userAddresses)
		.set({ active: false, isDefault: false, modifiedAt: new Date(), modifiedBy: userId })
		.where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
		.returning({ id: userAddresses.id });
	return !!deleted;
};

export const setDefault = async (id, userId) => {
	return db.transaction(async (tx) => {
		await tx
			.update(userAddresses)
			.set({ isDefault: false, modifiedAt: new Date() })
			.where(and(eq(userAddresses.userId, userId), eq(userAddresses.isDefault, true)));

		const [address] = await tx
			.update(userAddresses)
			.set({ isDefault: true, modifiedAt: new Date(), modifiedBy: userId })
			.where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId), eq(userAddresses.active, true)))
			.returning();

		return address || null;
	});
};

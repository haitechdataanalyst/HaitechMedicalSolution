import { eq, desc, and } from 'drizzle-orm';
import { db } from '../config/index.js';
import { shipments } from '../schema/index.js';

export const create = async (orderId, data) => {
	const [row] = await db.insert(shipments).values({ orderId, ...data }).returning();
	return row;
};

export const findByOrderId = async (orderId) => {
	const [row] = await db.select().from(shipments)
		.where(and(eq(shipments.orderId, orderId), eq(shipments.active, true)))
		.orderBy(desc(shipments.createdAt))
		.limit(1);
	return row || null;
};

export const findByAwbNo = async (awbNo) => {
	const [row] = await db.select().from(shipments)
		.where(and(eq(shipments.awbNo, awbNo), eq(shipments.active, true)))
		.limit(1);
	return row || null;
};

export const findById = async (id) => {
	const [row] = await db.select().from(shipments)
		.where(and(eq(shipments.id, id), eq(shipments.active, true)))
		.limit(1);
	return row || null;
};

export const updateStatus = async (id, status, extra = {}) => {
	const [row] = await db.update(shipments)
		.set({ status, modifiedAt: new Date(), ...extra })
		.where(eq(shipments.id, id))
		.returning();
	return row;
};

export const updateTrackingEvents = async (id, trackingEvents) => {
	const [row] = await db.update(shipments)
		.set({ trackingEvents: JSON.stringify(trackingEvents), modifiedAt: new Date() })
		.where(eq(shipments.id, id))
		.returning();
	return row;
};

import { eq, and, or, gt, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { leads, leadCartItems } from '../schema/index.js';

// Counts recent submissions from either this email or this IP within the
// window — either dimension hitting the limit blocks the request, matching
// the "keep rate-limit behavior equivalent but persistent" requirement.
export const countRecentByEmailOrIp = async (email, ipAddress, sinceDate) => {
	const conditions = [eq(leads.email, email)];
	if (ipAddress) conditions.push(eq(leads.ipAddress, ipAddress));

	const [{ count }] = await db
		.select({ count: sql`count(*)::int` })
		.from(leads)
		.where(and(gt(leads.createdAt, sinceDate), or(...conditions)));

	return count;
};

// Inserts the lead and (for cart_quote) its line items in one transaction —
// a cart quote's items are only meaningful alongside their parent lead.
export const create = async ({ cartItems, ...leadData }) => {
	return db.transaction(async (tx) => {
		const [lead] = await tx.insert(leads).values(leadData).returning();

		if (cartItems?.length) {
			await tx.insert(leadCartItems).values(cartItems.map((item) => ({ ...item, leadId: lead.id })));
		}

		return lead;
	});
};

export const markEmailSent = async (id) => {
	const [row] = await db.update(leads).set({ emailSent: true }).where(eq(leads.id, id)).returning();
	return row || null;
};

export const findById = async (id) => {
	const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
	return row || null;
};

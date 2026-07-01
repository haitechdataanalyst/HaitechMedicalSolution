// FILE: haitech-medical-backend-main/src/controllers/admin.controller.js

import { eq, and, ilike, or, desc, asc, gte, lte, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders, orderItems, users, userDetails, coupons, couponUses, products } from '../schema/index.js';
import { orderRepository, couponRepository } from '../repositories/index.js';
import { orderService, paymentService, couponService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';
import { notFoundError, badRequestError, conflictError } from '../utils/index.js';
import { httpStatus } from '../constants/index.js';

// ── Orders ────────────────────────────────────────────────────────────────────

export const adminGetAllOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, userId, dateFrom, dateTo } = req.query;

  const result = await orderService.adminGetOrders({
    page: Number(page),
    limit: Number(limit),
    status: status || undefined,
  });

  // Apply additional in-query filters that the base service does not support yet:
  // userId filter and date range are handled here via a secondary DB query when needed.
  if (userId || dateFrom || dateTo) {
    const conditions = [eq(orders.active, true)];
    if (status) conditions.push(eq(orders.status, status));
    if (userId) conditions.push(eq(orders.userId, userId));
    if (dateFrom) conditions.push(gte(orders.createdAt, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(orders.createdAt, new Date(dateTo)));

    const where = and(...conditions);
    const offset = (Number(page) - 1) * Number(limit);

    const [rows, countRow] = await Promise.all([
      db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(Number(limit)).offset(offset),
      db.select({ count: sql`count(*)::int` }).from(orders).where(where),
    ]);

    const total = countRow[0]?.count ?? 0;
    return res.respond(httpStatus.OK, { orders: rows }, undefined, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
    });
  }

  return res.respond(httpStatus.OK, { orders: result.orders }, undefined, result.meta);
});

export const adminGetOrderDetail = catchAsync(async (req, res) => {
  const order = await orderRepository.findById(req.params.id);
  if (!order) throw notFoundError('Order not found');
  return res.respond(httpStatus.OK, { order });
});

export const adminUpdateOrder = catchAsync(async (req, res) => {
  const { status, reason } = req.body;
  const orderId = req.params.id;
  const adminId = req.user.id;

  const order = await orderRepository.findById(orderId);
  if (!order) throw notFoundError('Order not found');

  const updated = await orderRepository.updateStatus(orderId, adminId, status);

  // Log to order_status_history if table exists; silently skip if not yet migrated.
  try {
    await db.execute(
      sql`
        INSERT INTO order_status_history (order_id, status, changed_by, reason, created_at)
        VALUES (${orderId}, ${status}, ${adminId}, ${reason ?? null}, NOW())
      `
    );
  } catch {
    // order_status_history table may not exist yet — non-fatal
  }

  return res.respond(httpStatus.OK, { order: updated }, 'Order status updated');
});

// ── Users ─────────────────────────────────────────────────────────────────────

export const adminGetAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const conditions = [eq(users.active, true)];

  if (search) {
    const q = `%${search}%`;
    conditions.push(
      or(
        ilike(users.firstName, q),
        ilike(users.lastName, q),
        ilike(users.email, q),
        ilike(users.username, q),
      )
    );
  }

  const where = and(...conditions);

  const [rows, countRow] = await Promise.all([
    db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        email: users.email,
        phone: users.phone,
        active: users.active,
        createdAt: users.createdAt,
        modifiedAt: users.modifiedAt,
        emailVerified: userDetails.emailVerified,
        blacklisted: userDetails.blacklisted,
        authProvider: userDetails.authProvider,
      })
      .from(users)
      .leftJoin(userDetails, eq(userDetails.userId, users.id))
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(Number(limit))
      .offset(offset),
    db.select({ count: sql`count(*)::int` }).from(users).where(where),
  ]);

  const total = countRow[0]?.count ?? 0;
  return res.respond(httpStatus.OK, { users: rows }, undefined, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)) || 1,
  });
});

export const adminToggleUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.id;

  const [existing] = await db.select({ id: users.id, active: users.active }).from(users).where(eq(users.id, userId)).limit(1);
  if (!existing) throw notFoundError('User not found');

  const newActive = !existing.active;
  const [updated] = await db
    .update(users)
    .set({ active: newActive, modifiedAt: new Date(), modifiedBy: req.user.id })
    .where(eq(users.id, userId))
    .returning({ id: users.id, active: users.active, email: users.email });

  return res.respond(
    httpStatus.OK,
    { user: updated },
    `User ${newActive ? 'activated' : 'deactivated'} successfully`
  );
});

// ── Inventory ─────────────────────────────────────────────────────────────────

export const adminGetInventory = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // product_inventory is an optional table; attempt a LEFT JOIN and fall back
  // gracefully to plain products listing when it does not exist.
  let rows;
  let total = 0;

  try {
    const conditions = [eq(products.active, true)];
    if (search) {
      const q = `%${search}%`;
      conditions.push(or(ilike(products.name, q), ilike(products.sku, q)));
    }
    const where = and(...conditions);

    [rows] = await Promise.all([
      db.execute(
        sql`
          SELECT
            p.id           AS product_id,
            p.name         AS product_name,
            p.sku          AS product_sku,
            p.base_price   AS base_price,
            p.active       AS product_active,
            COALESCE(pi.quantity, 0)          AS quantity,
            COALESCE(pi.reserved_quantity, 0) AS reserved_quantity,
            (COALESCE(pi.quantity, 0) - COALESCE(pi.reserved_quantity, 0)) AS available_quantity
          FROM products p
          LEFT JOIN product_inventory pi ON pi.product_id = p.id
          WHERE p.active = true
          ORDER BY p.sort_order ASC
          LIMIT ${Number(limit)} OFFSET ${offset}
        `
      ),
    ]);

    const [countRow] = await db.execute(
      sql`SELECT COUNT(*)::int AS count FROM products WHERE active = true`
    );
    total = countRow?.count ?? 0;
    rows = rows;
  } catch {
    // product_inventory table does not exist — fall back to plain products
    const conditions = [eq(products.active, true)];
    if (search) {
      const q = `%${search}%`;
      conditions.push(or(ilike(products.name, q), ilike(products.sku, q)));
    }
    const where = and(...conditions);

    const [plainRows, countRow] = await Promise.all([
      db
        .select({
          productId: products.id,
          productName: products.name,
          productSku: products.sku,
          basePrice: products.basePrice,
          productActive: products.active,
        })
        .from(products)
        .where(where)
        .orderBy(asc(products.sortOrder))
        .limit(Number(limit))
        .offset(offset),
      db.select({ count: sql`count(*)::int` }).from(products).where(where),
    ]);

    rows = plainRows.map((r) => ({ ...r, quantity: null, reservedQuantity: null, availableQuantity: null }));
    total = countRow[0]?.count ?? 0;
  }

  return res.respond(httpStatus.OK, { inventory: rows }, undefined, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)) || 1,
  });
});

export const adminUpdateInventory = catchAsync(async (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity, reservedQuantity } = req.body;

  if (quantity == null && reservedQuantity == null) {
    throw badRequestError('Provide at least one of: quantity, reservedQuantity');
  }

  const [prod] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
  if (!prod) throw notFoundError('Product not found');

  // Upsert into product_inventory. If the table does not exist, this throws a
  // DB error which surfaces as a 500 — acceptable until the migration runs.
  const sets = [];
  const values = { productId };
  if (quantity != null) {
    values.quantity = quantity;
    sets.push('quantity = EXCLUDED.quantity');
  }
  if (reservedQuantity != null) {
    values.reservedQuantity = reservedQuantity;
    sets.push('reserved_quantity = EXCLUDED.reserved_quantity');
  }

  const updateClause = sets.join(', ');

  const [row] = await db.execute(
    sql`
      INSERT INTO product_inventory (product_id, quantity, reserved_quantity, updated_at)
      VALUES (
        ${productId},
        ${quantity ?? 0},
        ${reservedQuantity ?? 0},
        NOW()
      )
      ON CONFLICT (product_id) DO UPDATE SET
        ${sql.raw(updateClause)},
        updated_at = NOW()
      RETURNING *
    `
  );

  return res.respond(httpStatus.OK, { inventory: row }, 'Inventory updated');
});

// ── Payment Transactions ──────────────────────────────────────────────────────

export const adminGetPaymentTransactions = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, orderId, userId } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // Attempt to query payment_transactions table; fall back to orders table if absent.
  let rows;
  let total = 0;

  try {
    const whereParts = ['1=1'];
    if (orderId) whereParts.push(`pt.order_id = '${orderId}'`);
    if (userId) whereParts.push(`pt.user_id = '${userId}'`);
    const whereClause = whereParts.join(' AND ');

    const result = await db.execute(
      sql`
        SELECT
          pt.*,
          o.status        AS order_status,
          o.total         AS order_total,
          u.email         AS user_email,
          u.first_name    AS user_first_name,
          u.last_name     AS user_last_name
        FROM payment_transactions pt
        LEFT JOIN orders o ON o.id = pt.order_id
        LEFT JOIN users  u ON u.id = pt.user_id
        WHERE ${sql.raw(whereClause)}
        ORDER BY pt.created_at DESC
        LIMIT ${Number(limit)} OFFSET ${offset}
      `
    );

    const countResult = await db.execute(
      sql`SELECT COUNT(*)::int AS count FROM payment_transactions WHERE ${sql.raw(whereParts.join(' AND '))}`
    );

    rows = result;
    total = countResult[0]?.count ?? 0;
  } catch {
    // payment_transactions table absent — surface orders with payment details instead
    const conditions = [eq(orders.active, true)];
    if (orderId) conditions.push(eq(orders.id, orderId));
    if (userId) conditions.push(eq(orders.userId, userId));
    const where = and(...conditions);

    const [orderRows, countRow] = await Promise.all([
      db
        .select({
          id: orders.id,
          orderId: orders.id,
          userId: orders.userId,
          razorpayOrderId: orders.razorpayOrderId,
          razorpayPaymentId: orders.razorpayPaymentId,
          paymentStatus: orders.paymentStatus,
          total: orders.total,
          currency: orders.currency,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(Number(limit))
        .offset(offset),
      db.select({ count: sql`count(*)::int` }).from(orders).where(where),
    ]);

    rows = orderRows;
    total = countRow[0]?.count ?? 0;
  }

  return res.respond(httpStatus.OK, { transactions: rows }, undefined, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)) || 1,
  });
});

export const adminInitiateRefund = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const { amount, reason } = req.body;

  const refund = await paymentService.initiateRefund(orderId, amount ?? undefined);

  return res.respond(httpStatus.OK, { refund }, 'Refund initiated successfully');
});

// ── Coupons ───────────────────────────────────────────────────────────────────

export const adminListCoupons = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  // List all coupons (including inactive ones for admin view) with usage stats
  const offset = (Number(page) - 1) * Number(limit);

  const [rows, countRow] = await Promise.all([
    db
      .select({
        id: coupons.id,
        code: coupons.code,
        type: coupons.type,
        value: coupons.value,
        minOrderAmount: coupons.minOrderAmount,
        maxUses: coupons.maxUses,
        usedCount: coupons.usedCount,
        perUserLimit: coupons.perUserLimit,
        validFrom: coupons.validFrom,
        validUntil: coupons.validUntil,
        active: coupons.active,
        createdAt: coupons.createdAt,
        modifiedAt: coupons.modifiedAt,
        // usage stats from coupon_uses join
        totalUses: sql`(SELECT COUNT(*)::int FROM coupon_uses WHERE coupon_id = ${coupons.id})`,
        uniqueUsers: sql`(SELECT COUNT(DISTINCT user_id)::int FROM coupon_uses WHERE coupon_id = ${coupons.id})`,
        totalDiscountGiven: sql`(SELECT COALESCE(SUM(discount_amount), 0)::bigint FROM coupon_uses WHERE coupon_id = ${coupons.id})`,
      })
      .from(coupons)
      .orderBy(desc(coupons.createdAt))
      .limit(Number(limit))
      .offset(offset),
    db.select({ count: sql`count(*)::int` }).from(coupons),
  ]);

  const total = countRow[0]?.count ?? 0;
  return res.respond(
    httpStatus.OK,
    {
      coupons: rows.map((c) => ({
        ...c,
        value: Number(c.value),
        totalDiscountGiven: Number(c.totalDiscountGiven),
      })),
    },
    undefined,
    {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
    }
  );
});

export const adminCreateCoupon = catchAsync(async (req, res) => {
  const existing = await couponRepository.findByCode(req.body.code);
  if (existing) throw conflictError('Coupon code already exists');

  const coupon = await couponRepository.create({
    code: req.body.code.toUpperCase().trim(),
    type: req.body.type || 'percent',
    value: req.body.value,
    minOrderAmount: req.body.minOrderAmount ?? 0,
    maxUses: req.body.maxUses ?? null,
    perUserLimit: req.body.perUserLimit ?? 1,
    validFrom: req.body.validFrom ? new Date(req.body.validFrom) : new Date(),
    validUntil: req.body.validUntil ? new Date(req.body.validUntil) : null,
    active: true,
  });

  return res.respond(httpStatus.CREATED, { coupon }, 'Coupon created');
});

export const adminUpdateCoupon = catchAsync(async (req, res) => {
  const id = req.params.id;
  const existing = await couponRepository.findById(id);
  if (!existing) throw notFoundError('Coupon not found');

  const updates = {};
  if (req.body.code !== undefined) updates.code = req.body.code.toUpperCase().trim();
  if (req.body.type !== undefined) updates.type = req.body.type;
  if (req.body.value !== undefined) updates.value = req.body.value;
  if (req.body.minOrderAmount !== undefined) updates.minOrderAmount = req.body.minOrderAmount;
  if (req.body.maxUses !== undefined) updates.maxUses = req.body.maxUses;
  if (req.body.perUserLimit !== undefined) updates.perUserLimit = req.body.perUserLimit;
  if (req.body.validFrom !== undefined) updates.validFrom = new Date(req.body.validFrom);
  if (req.body.validUntil !== undefined) updates.validUntil = req.body.validUntil ? new Date(req.body.validUntil) : null;
  if (req.body.active !== undefined) updates.active = req.body.active;

  const coupon = await couponRepository.update(id, updates);
  return res.respond(httpStatus.OK, { coupon }, 'Coupon updated');
});

export const adminDeleteCoupon = catchAsync(async (req, res) => {
  const id = req.params.id;
  const existing = await couponRepository.findById(id);
  if (!existing) throw notFoundError('Coupon not found');

  await couponRepository.softDelete(id);
  return res.respond(httpStatus.OK, null, 'Coupon deactivated');
});

// ── Revenue analytics ─────────────────────────────────────────────────────────

export const adminGetRevenue = catchAsync(async (req, res) => {
  const now = new Date();

  // Daily — last 30 days grouped by day
  const dailyStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Monthly — last 12 months grouped by month
  const monthlyStart = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  // Yearly — last 5 years grouped by year
  const yearlyStart = new Date(now.getFullYear() - 4, 0, 1);

  const paidWhere = `active = true AND payment_status = 'paid'`;

  const [dailyRows, monthlyRows, yearlyRows, summary] = await Promise.all([
    db.execute(
      sql`
        SELECT
          date(created_at)                          AS date,
          COALESCE(SUM(total), 0)::bigint           AS revenue,
          COUNT(*)::int                             AS order_count
        FROM orders
        WHERE ${sql.raw(paidWhere)}
          AND created_at >= ${dailyStart}
        GROUP BY date(created_at)
        ORDER BY date(created_at)
      `
    ),
    db.execute(
      sql`
        SELECT
          TO_CHAR(created_at, 'YYYY-MM')            AS month,
          COALESCE(SUM(total), 0)::bigint           AS revenue,
          COUNT(*)::int                             AS order_count
        FROM orders
        WHERE ${sql.raw(paidWhere)}
          AND created_at >= ${monthlyStart}
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY TO_CHAR(created_at, 'YYYY-MM')
      `
    ),
    db.execute(
      sql`
        SELECT
          EXTRACT(YEAR FROM created_at)::int        AS year,
          COALESCE(SUM(total), 0)::bigint           AS revenue,
          COUNT(*)::int                             AS order_count
        FROM orders
        WHERE ${sql.raw(paidWhere)}
          AND created_at >= ${yearlyStart}
        GROUP BY EXTRACT(YEAR FROM created_at)
        ORDER BY EXTRACT(YEAR FROM created_at)
      `
    ),
    db.execute(
      sql`
        SELECT
          COALESCE(SUM(total), 0)::bigint           AS total_revenue,
          COUNT(*)::int                             AS total_orders,
          COALESCE(AVG(total), 0)::numeric          AS avg_order_value
        FROM orders
        WHERE ${sql.raw(paidWhere)}
      `
    ),
  ]);

  const toNum = (v) => (v == null ? 0 : Number(v));

  return res.respond(httpStatus.OK, {
    summary: {
      totalRevenue: toNum(summary[0]?.total_revenue),
      totalOrders: toNum(summary[0]?.total_orders),
      avgOrderValue: Math.round(toNum(summary[0]?.avg_order_value)),
    },
    daily: dailyRows.map((r) => ({
      date: r.date,
      revenue: toNum(r.revenue),
      orderCount: toNum(r.order_count),
    })),
    monthly: monthlyRows.map((r) => ({
      month: r.month,
      revenue: toNum(r.revenue),
      orderCount: toNum(r.order_count),
    })),
    yearly: yearlyRows.map((r) => ({
      year: toNum(r.year),
      revenue: toNum(r.revenue),
      orderCount: toNum(r.order_count),
    })),
  });
});

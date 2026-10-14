import { sql } from 'drizzle-orm';
import {
	pgTable,
	uuid,
	varchar,
	timestamp,
	boolean,
	integer,
	index,
	uniqueIndex,
	unique,
	text,
	smallint,
	decimal,
	date,
	jsonb,
	inet,
	check,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { authProviders } from '../constants/index.js';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	phone: varchar('phone', { length: 20 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
	modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	modifiedBy: uuid('modified_by').references(() => users.id, { onDelete: 'set null' }),
	active: boolean('active').default(true).notNull(),
});

export const userDetails = pgTable('user_details', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	emailVerified: boolean('email_verified').default(false).notNull(),
	phoneVerified: boolean('phone_verified').default(false).notNull(),
	blacklisted: boolean('blacklisted').default(false).notNull(),
	passwordHash: varchar('password_hash', { length: 255 }),
	oldPasswordHash: varchar('old_password_hash', { length: 255 }),
	googleSub: varchar('google_sub', { length: 255 }).unique(),
	// The Supabase auth.users.id for this account (Phase 4: Supabase is the
	// sole identity source). Nullable/unique — legacy rows are linked to it
	// lazily on first Supabase-authenticated request, matched by email.
	supabaseId: uuid('supabase_id').unique(),
	authProvider: varchar('auth_provider', { length: 30 }).default(authProviders.LOCAL).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	modifiedBy: uuid('modified_by').references(() => users.id, { onDelete: 'set null' }),
	active: boolean('active').default(true).notNull(),
});

export const userAddresses = pgTable(
	'user_addresses',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		fullName: varchar('full_name', { length: 150 }).notNull(),
		phone: varchar('phone', { length: 20 }).notNull(),
		addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
		addressLine2: varchar('address_line_2', { length: 255 }),
		landmark: varchar('landmark', { length: 255 }),
		city: varchar('city', { length: 100 }).notNull(),
		state: varchar('state', { length: 100 }).notNull(),
		postalCode: varchar('postal_code', { length: 20 }).notNull(),
		country: varchar('country', { length: 100 }).default('India').notNull(),
		addressType: varchar('address_type', { length: 30 }).default('home').notNull(),
		isDefault: boolean('is_default').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		modifiedBy: uuid('modified_by').references(() => users.id, { onDelete: 'set null' }),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_user_addresses_user_id').on(table.userId),
		defaultAddressPerUserUnique: uniqueIndex('uq_user_addresses_default_per_user')
			.on(table.userId)
			.where(sql`${table.isDefault} = true`),
	})
);

export const roles = pgTable('roles', {
	id: uuid('id').defaultRandom().primaryKey(),
	code: varchar('code', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 100 }).notNull(),
	description: varchar('description', { length: 255 }),
	active: boolean('active').default(true).notNull(),
});

export const orders = pgTable(
	'orders',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		status: varchar('status', { length: 30 }).default('pending').notNull(),
		paymentStatus: varchar('payment_status', { length: 30 }).default('unpaid').notNull(),
		razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),
		razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
		subtotal: integer('subtotal').notNull(),
		tax: integer('tax').default(0).notNull(),
		shippingFee: integer('shipping_fee').default(0).notNull(),
		total: integer('total').notNull(),
		currency: varchar('currency', { length: 10 }).default('INR').notNull(),
		shippingAddressId: uuid('shipping_address_id').references(() => userAddresses.id, { onDelete: 'set null' }),
		notes: varchar('notes', { length: 500 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		modifiedBy: uuid('modified_by').references(() => users.id, { onDelete: 'set null' }),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_orders_user_id').on(table.userId),
		statusIdx: index('idx_orders_status').on(table.status),
		// Phase 1 reconciliation (2026-09-24): these already existed live via
		// drizzle/0002_production_hardening.sql, run directly against
		// production outside drizzle-kit (CREATE INDEX CONCURRENTLY cannot run
		// inside drizzle-kit's transaction-wrapped migrations) — declared here
		// so the schema file matches reality.
		paymentStatusIdx: index('idx_orders_payment_status').on(table.paymentStatus),
		createdAtIdx: index('idx_orders_created_at').on(table.createdAt.desc()),
		razorpayOrderIdIdx: index('idx_orders_razorpay_order_id')
			.on(table.razorpayOrderId)
			.where(sql`${table.razorpayOrderId} IS NOT NULL`),
		razorpayOrderIdUniq: unique('uq_orders_razorpay_order_id').on(table.razorpayOrderId),
		razorpayPaymentIdUniq: unique('uq_orders_razorpay_payment_id').on(table.razorpayPaymentId),
	})
);

export const orderItems = pgTable(
	'order_items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		productId: varchar('product_id', { length: 255 }).notNull(),
		productName: varchar('product_name', { length: 255 }).notNull(),
		productBrand: varchar('product_brand', { length: 100 }),
		productSku: varchar('product_sku', { length: 100 }),
		quantity: integer('quantity').notNull(),
		unitPrice: integer('unit_price').notNull(),
		totalPrice: integer('total_price').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		orderIdIdx: index('idx_order_items_order_id').on(table.orderId),
		// Phase 1 reconciliation (2026-09-24): already live via 0002, declared
		// here to match reality — see orders table comment above.
		quantityPositive: check('chk_order_items_quantity', sql`${table.quantity} > 0`),
	})
);

// ── Payment Transactions ──────────────────────────────────────────────────────
// Immutable financial audit log — one row per gateway event (order created,
// payment captured, refund issued, etc.). Never updated after insert.
// Declared here to match drizzle/0002_production_hardening.sql, which created
// this table directly via raw SQL before it was added to this schema file.

export const paymentTransactions = pgTable(
	'payment_transactions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'restrict' }),
		razorpayOrderId: varchar('razorpay_order_id', { length: 100 }),
		razorpayPaymentId: varchar('razorpay_payment_id', { length: 100 }),
		razorpaySignature: varchar('razorpay_signature', { length: 512 }),
		eventType: varchar('event_type', { length: 50 }).notNull(),
		amount: integer('amount').notNull(),
		currency: varchar('currency', { length: 10 }).default('INR').notNull(),
		status: varchar('status', { length: 50 }).notNull(),
		gatewayResponse: jsonb('gateway_response').default({}).notNull(),
		metadata: jsonb('metadata').default({}).notNull(),
		processedAt: timestamp('processed_at', { withTimezone: true }).defaultNow().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		orderIdIdx: index('idx_pt_order_id').on(table.orderId),
		razorpayPaymentIdIdx: index('idx_pt_razorpay_payment_id')
			.on(table.razorpayPaymentId)
			.where(sql`${table.razorpayPaymentId} IS NOT NULL`),
		eventTypeIdx: index('idx_pt_event_type').on(table.eventType),
		createdAtIdx: index('idx_pt_created_at').on(table.createdAt),
		// Prevents the same gateway webhook event being recorded twice.
		eventDedupUniq: uniqueIndex('idx_pt_event_dedup')
			.on(table.razorpayPaymentId, table.eventType)
			.where(sql`${table.razorpayPaymentId} IS NOT NULL`),
	})
);

// ── Order Status History ─────────────────────────────────────────────────────
// Audit trail for order.status transitions. Declared here to match
// drizzle/0002_production_hardening.sql (see paymentTransactions comment above).

export const orderStatusHistory = pgTable(
	'order_status_history',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		fromStatus: varchar('from_status', { length: 50 }),
		toStatus: varchar('to_status', { length: 50 }).notNull(),
		changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
		reason: text('reason'),
		metadata: jsonb('metadata').default({}).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		orderIdIdx: index('idx_osh_order_id').on(table.orderId),
		createdAtIdx: index('idx_osh_created_at').on(table.createdAt),
	})
);

// ── Cart ─────────────────────────────────────────────────────────────────────

export const cartSessions = pgTable(
	'cart_sessions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.unique()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_cart_sessions_user_id').on(table.userId),
	})
);

export const cartItems = pgTable(
	'cart_items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		cartId: uuid('cart_id')
			.notNull()
			.references(() => cartSessions.id, { onDelete: 'cascade' }),
		productId: varchar('product_id', { length: 255 }).notNull(),
		productName: varchar('product_name', { length: 255 }).notNull(),
		productSku: varchar('product_sku', { length: 100 }),
		quantity: integer('quantity').notNull().default(1),
		unitPrice: integer('unit_price').notNull().default(0),
		customization: text('customization'),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		cartIdIdx: index('idx_cart_items_cart_id').on(table.cartId),
		// Phase 1 reconciliation (2026-09-24): already live via 0002, declared
		// here to match reality — see orders table comment above.
		quantityPositive: check('chk_cart_items_quantity', sql`${table.quantity} > 0`),
	})
);

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlists = pgTable(
	'wishlists',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		productId: varchar('product_id', { length: 255 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_wishlists_user_id').on(table.userId),
		userProductUniq: uniqueIndex('uq_wishlists_user_product').on(table.userId, table.productId),
	})
);

// ── Roles ─────────────────────────────────────────────────────────────────────

export const userRoles = pgTable(
	'user_roles',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		roleId: uuid('role_id')
			.notNull()
			.references(() => roles.id, { onDelete: 'cascade' }),
		assignedBy: uuid('assigned_by').references(() => users.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		userRoleUnique: uniqueIndex('uq_user_roles_user_role').on(table.userId, table.roleId),
		userIdIdx: index('idx_user_roles_user_id').on(table.userId),
		roleIdIdx: index('idx_user_roles_role_id').on(table.roleId),
	})
);

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviews = pgTable(
	'reviews',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		productId: varchar('product_id', { length: 255 }).notNull(),
		orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
		rating: smallint('rating').notNull(),
		title: varchar('title', { length: 200 }),
		body: text('body'),
		verifiedPurchase: boolean('verified_purchase').default(false).notNull(),
		approved: boolean('approved').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_reviews_product_id').on(table.productId),
		userIdIdx: index('idx_reviews_user_id').on(table.userId),
		userProductUniq: uniqueIndex('uq_reviews_user_product').on(table.userId, table.productId),
	})
);

// ── Shipments ─────────────────────────────────────────────────────────────────

export const shipments = pgTable(
	'shipments',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		awbNo: varchar('awb_no', { length: 100 }),
		dtdcRefNo: varchar('dtdc_ref_no', { length: 100 }),
		carrier: varchar('carrier', { length: 50 }).default('DTDC').notNull(),
		status: varchar('status', { length: 50 }).default('pending').notNull(),
		labelUrl: text('label_url'),
		trackingEvents: text('tracking_events'),
		originPincode: varchar('origin_pincode', { length: 10 }),
		destinationPincode: varchar('destination_pincode', { length: 10 }),
		estimatedDelivery: date('estimated_delivery'),
		shippedAt: timestamp('shipped_at'),
		deliveredAt: timestamp('delivered_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		orderIdIdx: index('idx_shipments_order_id').on(table.orderId),
		awbNoIdx: index('idx_shipments_awb_no').on(table.awbNo),
	})
);

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = pgTable(
	'notifications',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: varchar('type', { length: 50 }).notNull(),
		title: varchar('title', { length: 255 }).notNull(),
		body: text('body'),
		data: text('data'),
		read: boolean('read').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_notifications_user_id').on(table.userId),
		readIdx: index('idx_notifications_read').on(table.userId, table.read),
	})
);

// ── Brands ────────────────────────────────────────────────────────────────────
// Top-level brand entities (Admetec, Almadent, Medesy, Salli, Strauss).
// IDs intentionally match the root category IDs from the original JSON (1,10,20,30,40).

export const brands = pgTable(
	'brands',
	{
		id: integer('id').primaryKey(),
		slug: varchar('slug', { length: 100 }).notNull().unique(),
		name: varchar('name', { length: 100 }).notNull(),
		description: text('description'),
		image: text('image'), // Cloudinary URL — see products.defaultImage comment
		sortOrder: integer('sort_order').default(0).notNull(),
		active: boolean('active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	},
	(table) => ({
		slugIdx: uniqueIndex('uq_brands_slug').on(table.slug),
	})
);

// ── Categories ────────────────────────────────────────────────────────────────
// Hierarchical product categories. Root nodes are the brand pages (parent=null).
// IDs match the original JSON to preserve existing FK references in orderItems.

export const categories = pgTable(
	'categories',
	{
		id: integer('id').primaryKey(),
		slug: varchar('slug', { length: 100 }).notNull().unique(),
		name: varchar('name', { length: 100 }).notNull(),
		type: varchar('type', { length: 30 }).default('category').notNull(),
		description: text('description'),
		image: text('image'), // Cloudinary URL — see products.defaultImage comment
		parentId: integer('parent_id'),
		brandId: integer('brand_id').references(() => brands.id, { onDelete: 'set null' }),
		sortOrder: integer('sort_order').default(0).notNull(),
		specialPage: varchar('special_page', { length: 200 }),
		active: boolean('active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	},
	(table) => ({
		slugIdx: uniqueIndex('uq_categories_slug').on(table.slug),
		parentIdx: index('idx_categories_parent_id').on(table.parentId),
		brandIdx: index('idx_categories_brand_id').on(table.brandId),
	})
);

// ── Products ──────────────────────────────────────────────────────────────────
// Integer IDs match the original JSON (101, 102, …) so orderItems.product_id
// references remain consistent without a schema migration.

export const products = pgTable(
	'products',
	{
		id: integer('id').primaryKey(),
		slug: varchar('slug', { length: 200 }).notNull().unique(),
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description'),
		categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
		brandId: integer('brand_id').references(() => brands.id, { onDelete: 'set null' }),
		sku: varchar('sku', { length: 100 }),
		basePrice: integer('base_price'),
		currency: varchar('currency', { length: 10 }).default('INR').notNull(),
		hasVariants: boolean('has_variants').default(false).notNull(),
		variantType: varchar('variant_type', { length: 50 }),
		// text, not varchar(500): Cloudinary CDN URLs run longer than the old local paths
		defaultImage: text('default_image'),
		gallery: jsonb('gallery'), // string[] of Cloudinary URLs — mirrors frontend Product.gallery
		videos: jsonb('videos'), // string[] — schema only for now, mirrors frontend Product.videos
		catalogueFile: varchar('catalogue_file', { length: 500 }),
		colorCode: varchar('color_code', { length: 20 }),
		sortOrder: integer('sort_order').default(0).notNull(),
		// Complex nested JSON stored as text (not queried column-by-column)
		contentBlocks: text('content_blocks'),
		relatedProducts: text('related_products'),
		frameVariants: text('frame_variants'),
		active: boolean('active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	},
	(table) => ({
		slugIdx: uniqueIndex('uq_products_slug').on(table.slug),
		categoryIdx: index('idx_products_category_id').on(table.categoryId),
		brandIdx: index('idx_products_brand_id').on(table.brandId),
		priceIdx: index('idx_products_base_price').on(table.basePrice),
		activeIdx: index('idx_products_active').on(table.active),
	})
);

// ── Product Inventory ─────────────────────────────────────────────────────────
// Stock levels with optimistic locking (version column) and a reservation
// count separate from on-hand quantity. Declared here to match
// drizzle/0002_production_hardening.sql (see paymentTransactions comment above).

export const productInventory = pgTable(
	'product_inventory',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.unique()
			.references(() => products.id, { onDelete: 'cascade' }),
		quantity: integer('quantity').default(0).notNull(),
		reservedQuantity: integer('reserved_quantity').default(0).notNull(),
		reorderPoint: integer('reorder_point').default(10).notNull(),
		version: integer('version').default(0).notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_inventory_product_id').on(table.productId),
		quantityNonNegative: check('chk_inventory_quantity', sql`${table.quantity} >= 0`),
		reservedNonNegative: check('chk_inventory_reserved', sql`${table.reservedQuantity} >= 0`),
		availableNotOverReserved: check('chk_inventory_available', sql`${table.quantity} >= ${table.reservedQuantity}`),
	})
);

// ── Coupons ───────────────────────────────────────────────────────────────────

export const coupons = pgTable(
	'coupons',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		code: varchar('code', { length: 50 }).notNull().unique(),
		type: varchar('type', { length: 20 }).default('percent').notNull(),
		value: decimal('value', { precision: 10, scale: 2 }).notNull(),
		minOrderAmount: integer('min_order_amount').default(0).notNull(),
		maxUses: integer('max_uses'),
		usedCount: integer('used_count').default(0).notNull(),
		perUserLimit: integer('per_user_limit').default(1).notNull(),
		validFrom: timestamp('valid_from').defaultNow().notNull(),
		validUntil: timestamp('valid_until'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
		active: boolean('active').default(true).notNull(),
	},
	(table) => ({
		codeIdx: uniqueIndex('uq_coupons_code').on(table.code),
		// Phase 1 reconciliation (2026-09-24): already live via 0002, declared
		// here to match reality — see orders table comment above.
		valuePositive: check('chk_coupons_discount', sql`${table.value} > 0`),
	})
);

export const couponUses = pgTable(
	'coupon_uses',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		couponId: uuid('coupon_id')
			.notNull()
			.references(() => coupons.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
		discountAmount: integer('discount_amount').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		couponUserIdx: index('idx_coupon_uses_coupon_user').on(table.couponId, table.userId),
		// Phase 1 reconciliation (2026-09-24): already live via 0002, declared
		// here to match reality — see orders table comment above.
		couponIdIdx: index('idx_coupon_uses_coupon_id').on(table.couponId),
		userIdIdx: index('idx_coupon_uses_user_id').on(table.userId),
		couponUserUniq: uniqueIndex('idx_coupon_uses_unique')
			.on(table.couponId, table.userId)
			.where(sql`${table.couponId} IS NOT NULL`),
	})
);

// ── Return Requests ───────────────────────────────────────────────────────────

export const return_requests = pgTable(
	'return_requests',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		reason: varchar('reason', { length: 100 }).notNull(),
		description: text('description'),
		status: varchar('status', { length: 50 }).default('pending').notNull(),
		adminNotes: text('admin_notes'),
		refundAmount: integer('refund_amount'),
		processedBy: uuid('processed_by').references(() => users.id, { onDelete: 'set null' }),
		processedAt: timestamp('processed_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		orderIdIdx: index('idx_return_requests_order_id').on(table.orderId),
		userIdIdx: index('idx_return_requests_user_id').on(table.userId),
		statusIdx: index('idx_return_requests_status').on(table.status),
		// Phase 1 reconciliation (2026-09-24): added as a supplemental
		// statement alongside 0002, since chk_return_status was originally
		// defined inline inside a CREATE TABLE IF NOT EXISTS that no-ops when
		// the table already exists (it did) — declared here to match reality.
		statusAllowed: check('chk_return_status', sql`${table.status} IN ('pending', 'approved', 'rejected', 'completed')`),
	})
);

// ── Security Audit Log ───────────────────────────────────────────────────────
// Cross-cutting security/auth event log (login attempts, lockouts, token
// events, etc.) — not owned by any single business domain. Declared here to
// match drizzle/0002_production_hardening.sql (see paymentTransactions
// comment above).

export const securityAuditLog = pgTable(
	'security_audit_log',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		eventType: varchar('event_type', { length: 100 }).notNull(),
		userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
		ipAddress: inet('ip_address'),
		userAgent: text('user_agent'),
		requestId: varchar('request_id', { length: 100 }),
		metadata: jsonb('metadata').default({}).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('idx_sal_user_id').on(table.userId),
		eventTypeIdx: index('idx_sal_event_type').on(table.eventType),
		ipAddressIdx: index('idx_sal_ip_address').on(table.ipAddress),
		createdAtIdx: index('idx_sal_created_at').on(table.createdAt),
	})
);

// ── Leads ─────────────────────────────────────────────────────────────────────
// Phase 2: durable persistence for the 3 previously email-only lead-capture
// flows (contact form, single-product quote, cart-wide quote). `source`
// discriminates which flow produced the row. `productId`/`productName`/
// `productSku`/`selectedVariant` are only populated for source=product_quote;
// `lead_cart_items` rows are only populated for source=cart_quote (a cart
// quote can list multiple products — one lead row, many line-item rows).
// No FK to a variants table yet — product_variants doesn't exist until
// Phase 3, so `selectedVariant` stays a plain label snapshot for now.

export const leads = pgTable(
	'leads',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		source: varchar('source', { length: 30 }).notNull(),
		name: varchar('name', { length: 100 }).notNull(),
		email: varchar('email', { length: 255 }).notNull(),
		phone: varchar('phone', { length: 20 }).notNull(),
		state: varchar('state', { length: 100 }),
		postcode: varchar('postcode', { length: 15 }),
		// Nullable, unlike contact_form/product_quote's required country: the
		// cart_quote flow (quote.ts) never collects a country field at all.
		country: varchar('country', { length: 2 }),
		subject: varchar('subject', { length: 200 }).notNull(),
		// Nullable: contact_form/product_quote require a message, but
		// cart_quote's message field is optional (the cart items themselves
		// carry the request).
		message: text('message'),
		productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
		productName: varchar('product_name', { length: 200 }),
		productSku: varchar('product_sku', { length: 100 }),
		selectedVariant: varchar('selected_variant', { length: 200 }),
		status: varchar('status', { length: 20 }).default('new').notNull(),
		ipAddress: inet('ip_address'),
		userAgent: text('user_agent'),
		emailSent: boolean('email_sent').default(false).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: index('idx_leads_email').on(table.email),
		ipAddressIdx: index('idx_leads_ip_address').on(table.ipAddress),
		createdAtIdx: index('idx_leads_created_at').on(table.createdAt),
		statusIdx: index('idx_leads_status').on(table.status),
		productIdIdx: index('idx_leads_product_id').on(table.productId),
		sourceAllowed: check('chk_leads_source', sql`${table.source} IN ('contact_form', 'product_quote', 'cart_quote')`),
		statusAllowed: check('chk_leads_status', sql`${table.status} IN ('new', 'contacted', 'converted', 'closed')`),
	})
);

export const leadCartItems = pgTable(
	'lead_cart_items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		leadId: uuid('lead_id')
			.notNull()
			.references(() => leads.id, { onDelete: 'cascade' }),
		productName: varchar('product_name', { length: 255 }).notNull(),
		sku: varchar('sku', { length: 100 }),
		quantity: integer('quantity').notNull(),
		unitPrice: integer('unit_price'),
		customization: text('customization'),
	},
	(table) => ({
		leadIdIdx: index('idx_lead_cart_items_lead_id').on(table.leadId),
		quantityPositive: check('chk_lead_cart_items_quantity', sql`${table.quantity} > 0`),
	})
);

// ── Product Normalization (Phase 3A) ─────────────────────────────────────────
// EXPAND-only: these tables exist alongside products.contentBlocks/
// frameVariants/variants (still the live source for the storefront). No data
// is migrated into them yet, no API/route reads or writes them yet. Phase 3B+
// backfills from data/products.json; only then does the frontend cut over.

export const productOptions = pgTable(
	'product_options',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 100 }).notNull(),
		inputType: varchar('input_type', { length: 20 }).notNull(),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_options_product_id').on(table.productId),
		inputTypeAllowed: check('chk_product_options_input_type', sql`${table.inputType} IN ('select', 'swatch', 'radio')`),
	})
);

export const productOptionValues = pgTable(
	'product_option_values',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		optionId: uuid('option_id')
			.notNull()
			.references(() => productOptions.id, { onDelete: 'cascade' }),
		label: varchar('label', { length: 100 }).notNull(),
		code: varchar('code', { length: 50 }),
		hexColor: varchar('hex_color', { length: 20 }),
		priceModifier: integer('price_modifier').default(0).notNull(),
		imageUrl: text('image_url'),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		optionIdIdx: index('idx_product_option_values_option_id').on(table.optionId),
	})
);

export const productVariants = pgTable(
	'product_variants',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		sku: varchar('sku', { length: 100 }).notNull().unique(),
		price: integer('price'),
		currency: varchar('currency', { length: 10 }).default('INR').notNull(),
		imageUrl: text('image_url'),
		active: boolean('active').default(true).notNull(),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		modifiedAt: timestamp('modified_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_variants_product_id').on(table.productId),
	})
);

// Records which option values make up a given variant (e.g. variant X =
// {Frame: Blues} + {Color: Grey}) — without this, product_variants and
// product_options/product_option_values would be structurally unrelated.
export const productVariantOptionValues = pgTable(
	'product_variant_option_values',
	{
		variantId: uuid('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'cascade' }),
		optionValueId: uuid('option_value_id')
			.notNull()
			.references(() => productOptionValues.id, { onDelete: 'cascade' }),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.variantId, table.optionValueId] }),
		optionValueIdIdx: index('idx_pvov_option_value_id').on(table.optionValueId),
	})
);

export const productImages = pgTable(
	'product_images',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		url: text('url').notNull(),
		altText: varchar('alt_text', { length: 255 }),
		sortOrder: integer('sort_order').default(0).notNull(),
		isPrimary: boolean('is_primary').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_images_product_id').on(table.productId),
	})
);

export const productSpecifications = pgTable(
	'product_specifications',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		label: varchar('label', { length: 100 }).notNull(),
		value: text('value').notNull(),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_specifications_product_id').on(table.productId),
	})
);

export const productPackageContents = pgTable(
	'product_package_contents',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		itemLabel: varchar('item_label', { length: 255 }).notNull(),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_package_contents_product_id').on(table.productId),
	})
);

export const productRelationships = pgTable(
	'product_relationships',
	{
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		relatedProductId: integer('related_product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.productId, table.relatedProductId] }),
		relatedProductIdIdx: index('idx_product_relationships_related_product_id').on(table.relatedProductId),
	})
);

export const productAddons = pgTable(
	'product_addons',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		label: varchar('label', { length: 200 }).notNull(),
		price: integer('price'),
		sku: varchar('sku', { length: 100 }),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_addons_product_id').on(table.productId),
	})
);

export const productCustomFields = pgTable(
	'product_custom_fields',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		fieldKey: varchar('field_key', { length: 100 }).notNull(),
		label: varchar('label', { length: 200 }).notNull(),
		fieldType: varchar('field_type', { length: 20 }).notNull(),
		options: jsonb('options'),
		required: boolean('required').default(false).notNull(),
		maxLength: integer('max_length'),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		productIdIdx: index('idx_product_custom_fields_product_id').on(table.productId),
		fieldTypeAllowed: check('chk_product_custom_fields_field_type', sql`${table.fieldType} IN ('text', 'number', 'select', 'textarea', 'boolean')`),
	})
);

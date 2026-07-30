import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, boolean, integer, index, uniqueIndex, text, smallint, decimal, date, jsonb } from 'drizzle-orm/pg-core';
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
	})
);

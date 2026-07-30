/**
 * Seed script — populates brands, categories, and products from JSON data files.
 * Run:  node --env-file=.env scripts/seed.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataDir = join(__dirname, '../../data');

// ── Load JSON files ───────────────────────────────────────────────────────────
const categoriesRaw = JSON.parse(readFileSync(join(dataDir, 'categories.json'), 'utf-8'));
const productsRaw   = JSON.parse(readFileSync(join(dataDir, 'products.json'),   'utf-8'));

// ── Connect ───────────────────────────────────────────────────────────────────
const sql = postgres({
	host:     process.env.POSTGRES_HOST     || 'localhost',
	port:     Number(process.env.POSTGRES_PORT) || 5432,
	user:     process.env.POSTGRES_USER     || 'postgres',
	password: process.env.POSTGRES_PASS     || '',
	database: process.env.POSTGRES_DB       || 'haitech_medical',
	ssl:      process.env.POSTGRES_SSL === 'true' ? 'require' : false,
	max: 1,
});
const db = drizzle(sql);

// ── Schema (inline so script is self-contained) ───────────────────────────────
import { pgTable, integer, varchar, text, boolean, timestamp, index, uniqueIndex, jsonb } from 'drizzle-orm/pg-core';

const brands = pgTable('brands', {
	id: integer('id').primaryKey(),
	slug: varchar('slug', { length: 100 }).notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description'),
	image: text('image'),
	sortOrder: integer('sort_order').default(0).notNull(),
	active: boolean('active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	modifiedAt: timestamp('modified_at').defaultNow().notNull(),
});

const categories = pgTable('categories', {
	id: integer('id').primaryKey(),
	slug: varchar('slug', { length: 100 }).notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	type: varchar('type', { length: 30 }).default('category').notNull(),
	description: text('description'),
	image: text('image'),
	parentId: integer('parent_id'),
	brandId: integer('brand_id'),
	sortOrder: integer('sort_order').default(0).notNull(),
	specialPage: varchar('special_page', { length: 200 }),
	active: boolean('active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	modifiedAt: timestamp('modified_at').defaultNow().notNull(),
});

const products = pgTable('products', {
	id: integer('id').primaryKey(),
	slug: varchar('slug', { length: 200 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	categoryId: integer('category_id'),
	brandId: integer('brand_id'),
	sku: varchar('sku', { length: 100 }),
	basePrice: integer('base_price'),
	currency: varchar('currency', { length: 10 }).default('INR').notNull(),
	hasVariants: boolean('has_variants').default(false).notNull(),
	variantType: varchar('variant_type', { length: 50 }),
	defaultImage: text('default_image'),
	gallery: jsonb('gallery'),
	videos: jsonb('videos'),
	catalogueFile: varchar('catalogue_file', { length: 500 }),
	colorCode: varchar('color_code', { length: 20 }),
	sortOrder: integer('sort_order').default(0).notNull(),
	contentBlocks: text('content_blocks'),
	relatedProducts: text('related_products'),
	frameVariants: text('frame_variants'),
	active: boolean('active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	modifiedAt: timestamp('modified_at').defaultNow().notNull(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normalize price to integer subunit.
// INR prices in products.json are already in paise (e.g. 201000 = ₹2010).
// AUD/USD prices are in the main unit (e.g. 12.99) → convert to cents (1299).
const toSubunit = (price) => {
	if (price == null) return null;
	if (Number.isInteger(price)) return price;        // already paise / whole number
	return Math.round(price * 100);                   // 12.99 AUD → 1299 cents
};

// Build a parent→rootBrand map for product brand resolution
const buildBrandMap = (cats) => {
	const catById = Object.fromEntries(cats.map((c) => [c.id, c]));
	const getBrandId = (catId) => {
		let cur = catById[catId];
		while (cur && cur.parent !== null) {
			cur = catById[cur.parent];
		}
		return cur?.id ?? null;
	};
	const map = {};
	for (const c of cats) {
		map[c.id] = getBrandId(c.id);
	}
	return map;
};

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
	console.log('🌱 Seeding database…\n');

	// 1. Brands — root-level categories (parent === null)
	const rootCats = categoriesRaw.filter((c) => c.parent === null);

	console.log(`📦 Inserting ${rootCats.length} brands…`);
	for (const c of rootCats) {
		await db.insert(brands).values({
			id:          c.id,
			slug:        c.slug,
			name:        c.name,
			description: c.description ?? null,
			image:       c.image ?? null,
			sortOrder:   c.order ?? 0,
			active:      true,
		}).onConflictDoUpdate({
			target: brands.id,
			set: {
				slug:        c.slug,
				name:        c.name,
				description: c.description ?? null,
				image:       c.image ?? null,
				sortOrder:   c.order ?? 0,
				modifiedAt:  new Date(),
			},
		});
	}
	console.log('  ✓ Brands done');

	// 2. Categories (all of them, including root)
	console.log(`📂 Inserting ${categoriesRaw.length} categories…`);
	const brandMap = buildBrandMap(categoriesRaw);

	for (const c of categoriesRaw) {
		const brandId = c.parent === null ? c.id : brandMap[c.id];
		await db.insert(categories).values({
			id:          c.id,
			slug:        c.slug,
			name:        c.name,
			type:        c.type ?? 'category',
			description: c.description ?? null,
			image:       c.image ?? null,
			parentId:    c.parent ?? null,
			brandId:     brandId ?? null,
			sortOrder:   c.order ?? 0,
			specialPage: c.specialPage ?? null,
			active:      true,
		}).onConflictDoUpdate({
			target: categories.id,
			set: {
				slug:        c.slug,
				name:        c.name,
				description: c.description ?? null,
				image:       c.image ?? null,
				parentId:    c.parent ?? null,
				brandId:     brandId ?? null,
				sortOrder:   c.order ?? 0,
				specialPage: c.specialPage ?? null,
				modifiedAt:  new Date(),
			},
		});
	}
	console.log('  ✓ Categories done');

	// 3. Products
	console.log(`🛒 Inserting ${productsRaw.length} products…`);

	for (const p of productsRaw) {
		const brandId = brandMap[p.category] ?? null;

		await db.insert(products).values({
			id:             p.id,
			slug:           p.slug,
			name:           p.name,
			description:    p.description ?? null,
			categoryId:     p.category ?? null,
			brandId:        brandId,
			sku:            p.sku ?? null,
			basePrice:      toSubunit(p.basePrice),
			currency:       p.currency ?? 'INR',
			hasVariants:    p.hasVariants ?? false,
			variantType:    p.variantType ?? null,
			defaultImage:   p.defaultImage ?? null,
			gallery:        p.gallery ?? null,
			videos:         p.videos ?? null,
			catalogueFile:  p.catalogueFile ?? null,
			colorCode:      p.colorCode ?? null,
			sortOrder:      p.order ?? 0,
			contentBlocks:  p.contentBlocks  ? JSON.stringify(p.contentBlocks)  : null,
			relatedProducts:p.relatedProducts ? JSON.stringify(p.relatedProducts): null,
			frameVariants:  p.frameVariants   ? JSON.stringify(p.frameVariants)  : null,
			active:         true,
		}).onConflictDoUpdate({
			target: products.id,
			set: {
				slug:           p.slug,
				name:           p.name,
				description:    p.description ?? null,
				categoryId:     p.category ?? null,
				brandId:        brandId,
				sku:            p.sku ?? null,
				basePrice:      toSubunit(p.basePrice),
				currency:       p.currency ?? 'INR',
				hasVariants:    p.hasVariants ?? false,
				variantType:    p.variantType ?? null,
				defaultImage:   p.defaultImage ?? null,
				gallery:        p.gallery ?? null,
				videos:         p.videos ?? null,
				catalogueFile:  p.catalogueFile ?? null,
				colorCode:      p.colorCode ?? null,
				sortOrder:      p.order ?? 0,
				contentBlocks:  p.contentBlocks  ? JSON.stringify(p.contentBlocks)  : null,
				relatedProducts:p.relatedProducts ? JSON.stringify(p.relatedProducts): null,
				frameVariants:  p.frameVariants   ? JSON.stringify(p.frameVariants)  : null,
				modifiedAt:     new Date(),
			},
		});
	}
	console.log('  ✓ Products done');

	console.log('\n✅ Seed complete!');
	console.log(`   Brands:     ${rootCats.length}`);
	console.log(`   Categories: ${categoriesRaw.length}`);
	console.log(`   Products:   ${productsRaw.length}`);

	await sql.end();
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err.message);
	sql.end();
	process.exit(1);
});

/**
 * Phase 3B — Catalog Data Import (DB only, no frontend/API changes).
 *
 * Populates the normalized product tables (created empty in Phase 3A) from
 * the existing catalog data. Hybrid source, per explicit approval:
 *   - DB products.content_blocks  -> product_specifications, product_package_contents,
 *                                     product_custom_fields, product_addons
 *   - DB products.frame_variants  -> product_options/product_option_values/
 *                                     product_variants (frame-color type only)
 *   - DB products.gallery         -> product_images
 *   - DB products.related_products-> product_relationships
 *   - JSON data/products.json's variants[] -> product_variants +
 *     product_variant_option_values (grit/model/color types — this array was
 *     never migrated into the DB's products table, confirmed by direct
 *     inspection; JSON is the only place it exists)
 *
 * Products are matched DB <-> JSON by slug, never array position. The whole
 * run aborts with no writes if any JSON product has no matching DB row.
 *
 * Idempotent / duplicate-safe / resumable: for each product, every child
 * table's existing rows are deleted and re-inserted inside one transaction
 * per product. Re-running the whole script (in part or in full) always
 * converges to the same correct end state — safe to resume after an
 * interruption by simply running it again.
 *
 * Never writes to the `products` table itself.
 *
 * Run:  node --env-file=.env scripts/import-normalized-catalog.js
 * Dry run (rolls back everything at the end, nothing committed):
 *        node --env-file=.env scripts/import-normalized-catalog.js --dry-run
 */

const DRY_RUN = process.argv.includes('--dry-run');

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import {
	products,
	productOptions,
	productOptionValues,
	productVariants,
	productVariantOptionValues,
	productImages,
	productSpecifications,
	productPackageContents,
	productRelationships,
	productAddons,
	productCustomFields,
} from '../src/schema/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');

const productsRaw = JSON.parse(readFileSync(join(dataDir, 'products.json'), 'utf-8'));

const sql = postgres({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: Number(process.env.POSTGRES_PORT) || 5432,
	user: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASS || '',
	database: process.env.POSTGRES_DB || 'haitech_medical',
	ssl: process.env.POSTGRES_SSL === 'true' ? 'require' : false,
	max: 1,
});
const db = drizzle(sql);

// Same subunit rule already established in scripts/seed.js for
// products.basePrice — reused as-is for variant/addon prices for
// consistency with how this codebase already interprets the source data.
const toSubunit = (price) => {
	if (price === null || price === undefined) return null;
	if (Number.isInteger(price)) return price;
	return Math.round(price * 100);
};

const ALLOWED_FIELD_TYPES = new Set(['text', 'number', 'select', 'textarea', 'boolean']);
const titleCase = (s) =>
	String(s)
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());

const parseJsonColumn = (text) => {
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
};

const findBlock = (blocks, type) => (Array.isArray(blocks) ? blocks.find((b) => b.type === type) : null);

// product_variants.sku is globally UNIQUE (per the approved architecture),
// but the source data's per-variant "sku" isn't always a true global code —
// e.g. Medesy model variants use a descriptive label, and two different
// base products (forceps-2500 / forceps-2400) both offer a model called
// "Lower roots, fragments". If the candidate sku already belongs to a
// DIFFERENT product, disambiguate deterministically by appending this
// product's own id, and record it as a warning. If it belongs to this same
// product (or doesn't exist yet), use it unchanged — a normal upsert.
async function resolveVariantSku(tx, candidateSku, productId, slug) {
	const [existing] = await tx.select({ productId: productVariants.productId }).from(productVariants).where(eq(productVariants.sku, candidateSku)).limit(1);
	if (!existing || existing.productId === productId) return candidateSku;
	const disambiguated = `${candidateSku}-${productId}`;
	report.warnings.push(`${slug}: variant sku "${candidateSku}" already belongs to a different product — disambiguated to "${disambiguated}"`);
	return disambiguated;
}

// ── Reconciliation report accumulator ───────────────────────────────────────
const report = {
	productsProcessed: 0,
	warnings: [],
	perProduct: {},
};

const recordCounts = (slug, counts) => {
	report.perProduct[slug] = counts;
};

// ── Per-product import ───────────────────────────────────────────────────────
async function importProduct(tx, dbProduct, jsonProduct, validProductIds) {
	const productId = dbProduct.id;
	const blocks = parseJsonColumn(dbProduct.contentBlocks);
	const frameVariantsData = parseJsonColumn(dbProduct.frameVariants);
	const relatedIds = parseJsonColumn(dbProduct.relatedProducts) || [];
	const gallery = Array.isArray(dbProduct.gallery) ? dbProduct.gallery : [];

	const counts = { specifications: 0, packageContents: 0, images: 0, relationships: 0, options: 0, optionValues: 0, variants: 0, addons: 0, customFields: 0 };

	// Clear this product's existing rows in every child table (children of
	// children first, to respect FKs), then re-insert fresh. Makes the whole
	// script idempotent/duplicate-safe/resumable on any re-run.
	const existingVariantIds = (await tx.select({ id: productVariants.id }).from(productVariants).where(eq(productVariants.productId, productId))).map((r) => r.id);
	if (existingVariantIds.length) {
		await tx.delete(productVariantOptionValues).where(inArray(productVariantOptionValues.variantId, existingVariantIds));
	}
	await tx.delete(productVariants).where(eq(productVariants.productId, productId));
	const existingOptionIds = (await tx.select({ id: productOptions.id }).from(productOptions).where(eq(productOptions.productId, productId))).map((r) => r.id);
	if (existingOptionIds.length) {
		await tx.delete(productOptionValues).where(inArray(productOptionValues.optionId, existingOptionIds));
	}
	await tx.delete(productOptions).where(eq(productOptions.productId, productId));
	await tx.delete(productImages).where(eq(productImages.productId, productId));
	await tx.delete(productSpecifications).where(eq(productSpecifications.productId, productId));
	await tx.delete(productPackageContents).where(eq(productPackageContents.productId, productId));
	await tx.delete(productRelationships).where(eq(productRelationships.productId, productId));
	await tx.delete(productAddons).where(eq(productAddons.productId, productId));
	await tx.delete(productCustomFields).where(eq(productCustomFields.productId, productId));

	// ── product_specifications (content_blocks: specifications block) ───────
	const specBlock = findBlock(blocks, 'specifications');
	const specRows = specBlock?.data?.rows || specBlock?.data?.specs || [];
	if (specRows.length) {
		await tx.insert(productSpecifications).values(specRows.map((r, i) => ({ productId, label: r.label ?? '', value: String(r.value ?? ''), sortOrder: i })));
		counts.specifications = specRows.length;
	}

	// ── product_package_contents (content_blocks: info.packageContents) ─────
	const infoBlock = findBlock(blocks, 'info');
	const packageItems = infoBlock?.data?.packageContents || [];
	if (packageItems.length) {
		await tx.insert(productPackageContents).values(packageItems.map((label, i) => ({ productId, itemLabel: String(label), sortOrder: i })));
		counts.packageContents = packageItems.length;
	}

	// ── product_images (DB gallery column; defaultImage marked primary) ─────
	const imageUrls = [...new Set([dbProduct.defaultImage, ...gallery].filter(Boolean))];
	if (imageUrls.length) {
		await tx.insert(productImages).values(imageUrls.map((url, i) => ({ productId, url, sortOrder: i, isPrimary: url === dbProduct.defaultImage })));
		counts.images = imageUrls.length;
	}

	// ── product_relationships (DB related_products: flat id array) ──────────
	// Some source rows reference a related_product_id that doesn't exist as
	// a real product (pre-existing data-quality gaps in the catalog, e.g.
	// c0/c1/c2 -> 1023) — skip those with a warning rather than let the FK
	// constraint fail the whole product's import.
	const validRelatedIds = relatedIds.filter((rid) => validProductIds.has(rid));
	const danglingRelatedIds = relatedIds.filter((rid) => !validProductIds.has(rid));
	for (const rid of danglingRelatedIds) {
		report.warnings.push(`${dbProduct.slug}: related_products references product id ${rid}, which does not exist — skipped`);
	}
	if (validRelatedIds.length) {
		await tx
			.insert(productRelationships)
			.values(validRelatedIds.map((relatedProductId) => ({ productId, relatedProductId })))
			.onConflictDoNothing();
		counts.relationships = validRelatedIds.length;
	}

	// ── product_addons (content_blocks: actions.salliCustomization.accessories) ─
	const actionsBlock = findBlock(blocks, 'actions');
	const accessories = actionsBlock?.data?.salliCustomization?.accessories || [];
	if (accessories.length) {
		await tx.insert(productAddons).values(accessories.map((a, i) => ({ productId, label: a.label ?? '', price: toSubunit(a.price), sku: a.id ?? null, sortOrder: i })));
		counts.addons = accessories.length;
	}

	// ── product_custom_fields (content_blocks: actions.{customFields,prescription,templeTipEngraving,boxEngraving,frameSizes}) ─
	const customFieldRows = [];
	let sortOrder = 0;
	for (const cf of actionsBlock?.data?.customFields || []) {
		const fieldType = ALLOWED_FIELD_TYPES.has(cf.type) ? cf.type : 'text';
		if (!ALLOWED_FIELD_TYPES.has(cf.type)) report.warnings.push(`${dbProduct.slug}: customFields type "${cf.type}" not in allowed set, stored as "text"`);
		customFieldRows.push({
			productId,
			fieldKey: cf.name,
			label: cf.label ?? cf.name,
			fieldType,
			options: cf.options ? JSON.stringify(cf.options) : null,
			required: !!cf.required,
			maxLength: null,
			sortOrder: sortOrder++,
		});
	}
	if (actionsBlock?.data?.frameSizes?.length) {
		customFieldRows.push({
			productId,
			fieldKey: 'frameSize',
			label: 'Frame Size',
			fieldType: 'select',
			options: JSON.stringify(actionsBlock.data.frameSizes),
			required: false,
			maxLength: null,
			sortOrder: sortOrder++,
		});
	}
	if (actionsBlock?.data?.prescription?.enabled) {
		customFieldRows.push({
			productId,
			fieldKey: 'prescription',
			label: 'Prescription Upload',
			fieldType: 'boolean',
			options: JSON.stringify({ disclaimer: actionsBlock.data.prescription.disclaimer ?? null }),
			required: false,
			maxLength: null,
			sortOrder: sortOrder++,
		});
	}
	for (const key of ['templeTipEngraving', 'boxEngraving']) {
		const cfg = actionsBlock?.data?.[key];
		if (cfg?.enabled) {
			customFieldRows.push({
				productId,
				fieldKey: key,
				label: key === 'templeTipEngraving' ? 'Temple Tip Engraving' : 'Box Engraving',
				fieldType: 'text',
				options: JSON.stringify({ previewImage: cfg.previewImage ?? null, placeholder: cfg.placeholder ?? null }),
				required: false,
				maxLength: cfg.maxLength ?? null,
				sortOrder: sortOrder++,
			});
		}
	}
	if (customFieldRows.length) {
		await tx.insert(productCustomFields).values(customFieldRows);
		counts.customFields = customFieldRows.length;
	}

	// ── product_options / product_option_values / product_variants ──────────
	// (+ product_variant_option_values) — two independent sources depending
	// on variant_type, per the approved hybrid design.
	if (dbProduct.variantType === 'frame-color' && frameVariantsData) {
		const frames = frameVariantsData.availableFrames || [];
		const imagesMap = frameVariantsData.images || {};

		// Derive the distinct color suffix per frame from the images map's
		// "{frame}-{color}" keys — the only place color identity exists for
		// this variant type (no separate color list in the source data).
		const frameColorPairs = []; // [{frame, color, url}]
		for (const [key, url] of Object.entries(imagesMap)) {
			const frame = frames.find((f) => key.startsWith(`${f}-`));
			if (!frame) {
				report.warnings.push(`${dbProduct.slug}: image key "${key}" doesn't match any availableFrames entry, skipped`);
				continue;
			}
			const color = key.slice(frame.length + 1);
			frameColorPairs.push({ frame, color, url });
		}

		if (frames.length && frameColorPairs.length) {
			const [frameOption] = await tx.insert(productOptions).values({ productId, name: 'Frame', inputType: 'select', sortOrder: 0 }).returning();
			const [colorOption] = await tx.insert(productOptions).values({ productId, name: 'Color', inputType: 'swatch', sortOrder: 1 }).returning();
			counts.options = 2;

			const frameValueByName = new Map();
			for (const [i, frame] of frames.entries()) {
				const [row] = await tx
					.insert(productOptionValues)
					.values({ optionId: frameOption.id, label: titleCase(frame), code: frame, sortOrder: i })
					.returning();
				frameValueByName.set(frame, row);
			}

			const distinctColors = [...new Set(frameColorPairs.map((p) => p.color))];
			const colorValueByName = new Map();
			for (const [i, color] of distinctColors.entries()) {
				const sampleUrl = frameColorPairs.find((p) => p.color === color)?.url ?? null;
				const [row] = await tx
					.insert(productOptionValues)
					.values({ optionId: colorOption.id, label: titleCase(color), code: color, imageUrl: sampleUrl, sortOrder: i })
					.returning();
				colorValueByName.set(color, row);
			}
			counts.optionValues = frameValueByName.size + colorValueByName.size;

			for (const { frame, color, url } of frameColorPairs) {
				const candidateSku = `${dbProduct.sku || dbProduct.slug}-${frame}-${color}`.toUpperCase();
				const sku = await resolveVariantSku(tx, candidateSku, productId, dbProduct.slug);
				const [variant] = await tx
					.insert(productVariants)
					.values({ productId, sku, price: null, currency: dbProduct.currency || 'INR', imageUrl: url, active: true, sortOrder: counts.variants })
					.onConflictDoUpdate({ target: productVariants.sku, set: { imageUrl: url, active: true, modifiedAt: new Date() } })
					.returning();
				await tx
					.insert(productVariantOptionValues)
					.values([
						{ variantId: variant.id, optionValueId: frameValueByName.get(frame).id },
						{ variantId: variant.id, optionValueId: colorValueByName.get(color).id },
					])
					.onConflictDoNothing();
				counts.variants++;
			}
		}
	} else if (jsonProduct?.variants?.length) {
		const optionName = { grit: 'Grit', model: 'Model', color: 'Color' }[dbProduct.variantType] || 'Option';
		const inputType = dbProduct.variantType === 'color' ? 'swatch' : 'select';
		const [option] = await tx.insert(productOptions).values({ productId, name: optionName, inputType, sortOrder: 0 }).returning();
		counts.options = 1;

		for (const [i, v] of jsonProduct.variants.entries()) {
			const [optionValue] = await tx
				.insert(productOptionValues)
				.values({ optionId: option.id, label: v.name ?? v.id, code: v.id ?? null, hexColor: v.colorCode ?? null, imageUrl: v.image ?? null, sortOrder: i })
				.returning();
			counts.optionValues++;

			if (!v.sku) {
				report.warnings.push(`${dbProduct.slug}: variant "${v.id}" has no sku in JSON, skipped variant row`);
				continue;
			}
			const sku = await resolveVariantSku(tx, v.sku, productId, dbProduct.slug);
			const [variant] = await tx
				.insert(productVariants)
				.values({ productId, sku, price: toSubunit(v.price), currency: dbProduct.currency || 'INR', imageUrl: v.image ?? null, active: true, sortOrder: i })
				.onConflictDoUpdate({ target: productVariants.sku, set: { price: toSubunit(v.price), imageUrl: v.image ?? null, active: true, modifiedAt: new Date() } })
				.returning();
			await tx.insert(productVariantOptionValues).values({ variantId: variant.id, optionValueId: optionValue.id }).onConflictDoNothing();
			counts.variants++;
		}
	}

	recordCounts(dbProduct.slug, counts);
	report.productsProcessed++;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
	console.log('Phase 3B catalog import — starting\n');

	// Explicit deterministic order: the sku-collision disambiguation in
	// resolveVariantSku() depends on which product is processed first, so
	// processing order must be stable across every run for true idempotency.
	const dbProducts = await db.select().from(products).orderBy(products.id);
	const dbBySlug = new Map(dbProducts.map((p) => [p.slug, p]));
	const jsonBySlug = new Map(productsRaw.map((p) => [p.slug, p]));
	const validProductIds = new Set(dbProducts.map((p) => p.id));

	// Abort-before-writing check: every JSON product must exist in the DB,
	// matched by slug (never array position).
	const missing = [...jsonBySlug.keys()].filter((slug) => !dbBySlug.has(slug));
	if (missing.length) {
		console.error(`ABORTING — ${missing.length} JSON product(s) have no matching DB row by slug:`);
		console.error(missing.join(', '));
		await sql.end();
		process.exit(1);
	}
	console.log(`Slug match confirmed: all ${jsonBySlug.size} JSON products exist in the DB (${dbProducts.length} DB products total).\n`);
	if (DRY_RUN) console.log('*** DRY RUN — the entire run below happens inside one transaction that will be rolled back at the end. Nothing will be committed. ***\n');

	if (DRY_RUN) {
		// Whole run in one transaction, rolled back on purpose at the end —
		// this is a one-time diagnostic pass, not the resumable real run, so
		// per-product isolation isn't needed here.
		const DRY_RUN_ROLLBACK = new Error('__DRY_RUN_ROLLBACK__');
		try {
			await db.transaction(async (tx) => {
				for (const dbProduct of dbProducts) {
					const jsonProduct = jsonBySlug.get(dbProduct.slug) ?? null;
					await importProduct(tx, dbProduct, jsonProduct, validProductIds);
				}
				throw DRY_RUN_ROLLBACK;
			});
		} catch (err) {
			if (err !== DRY_RUN_ROLLBACK) throw err;
			console.log('(Rolled back on purpose — nothing committed.)\n');
		}
	} else {
		for (const dbProduct of dbProducts) {
			const jsonProduct = jsonBySlug.get(dbProduct.slug) ?? null;
			try {
				await db.transaction(async (tx) => {
					await importProduct(tx, dbProduct, jsonProduct, validProductIds);
				});
			} catch (err) {
				report.warnings.push(`${dbProduct.slug}: import FAILED — ${err.message}`);
				console.error(`  ✗ ${dbProduct.slug}: ${err.message}`);
			}
		}
	}

	console.log(`\nProcessed ${report.productsProcessed}/${dbProducts.length} products.`);
	if (report.warnings.length) {
		console.log(`\n${report.warnings.length} warning(s):`);
		report.warnings.forEach((w) => console.log(`  - ${w}`));
	}

	// Write the reconciliation report alongside the script for inspection.
	const { writeFileSync } = await import('fs');
	const reportFile = DRY_RUN ? 'phase3b-reconciliation-report.dry-run.json' : 'phase3b-reconciliation-report.json';
	writeFileSync(join(__dirname, reportFile), JSON.stringify(report, null, 2));
	console.log(`\nReconciliation report written to scripts/${reportFile}`);

	await sql.end();
}

main().catch(async (err) => {
	console.error('FATAL:', err);
	await sql.end();
	process.exit(1);
});

# Haitech Medical — Target E-Commerce Database Schema

Status: **Approved design, phased rollout not yet started** (approved 2026-09-23). This document is the target end-state; see "Adoption strategy" below for how to get there from the schema that exists today without a risky hard cutover.

## Context

This is a full audit of the site's data plus a from-scratch design for what the e-commerce database should look like — table count, relationships, and how DB management should work end to end.

Two parallel audits (frontend catalog/commerce flows; backend Drizzle schema/migrations) found:

- A real backend already exists: Express + Drizzle + Postgres, **23 tables**, reasonably mature (money stored as integer minor units, immutable payment audit log, optimistic-lock-friendly inventory with CHECK constraints, partial-unique indexes for "one default address"/"one review per user per product"). This is not a green-field project.
- The previously-referenced "43-section Master Architecture Policy" / "21-section audit" **does not exist as a file in either repo** — confirmed by full-text search and git-log search across both trees. Its rules survive only as `[[feedback_architecture_policy]]` comments scattered across ~12 files (Phases 1, 2, 4, 5, 6, 8 are each cited against real completed or in-progress work). This document is written to be committed to disk (see Deliverables) rather than live only in agent memory.
- This is a **fresh, from-scratch schema design** (not an incremental patch), covering the target end-state — followed by a mapping showing how to get there from the current 23 tables.
- **Phase 1 is repairing the broken migration ledger** — 4 of 5 SQL files under `drizzle/` were hand-run and never tracked by `drizzle-kit` (only migration `0000` has a snapshot/journal entry). No new schema work is safe to land until this is fixed.

Real gaps this schema closes:
1. **Zero persistence for leads.** `app/actions/contact.ts`, `productQuote.ts`, `quote.ts` validate, rate-limit (in-memory `Map`, resets on redeploy), and email — nothing is ever written to a database. A bounced email loses the lead permanently, with no record it ever happened.
2. **No real product-variant model.** 134 products span 7 distinct variant/customization shapes (plain color swatches, grit, named models, a 2-D frame×color matrix, a 4-axis saddle-chair configurator, free-form engraving/prescription fields, and purely-static display-only items) — all currently flattened into JSON blobs (`contentBlocks`, `frameVariants`, `variants[]`) on a single `products` row, or scattered across three separate un-related static JSON files (`frames.json`, `headlights.json`, `medesy.json`).
3. **Broken referential integrity.** `order_items.productId`, `cart_items.productId`, `wishlists.productId`, `reviews.productId` are all `varchar(255)` with **no FK to `products.id`** — this is the direct root cause of the still-open Headlights bug (a string slug sent where an integer product id is expected), currently inert only because `COMMERCE_ENABLED = false`.
4. `categories.parent_id` is self-referential but has no `.references()` — no DB-level protection against an orphaned category tree.
5. Mixed currency (`"INR"` / `"AUD"` / undefined) with no consistent per-row currency discipline outside the `orders` table, which already does this correctly.

---

## Current State (baseline — do not rebuild what already works)

Keep these largely as-is; they're already well-designed and the fresh schema below reuses them near-verbatim:

- **Identity**: `users`, `user_details`, `user_addresses`, `roles`, `user_roles` — Supabase is being migrated in as the sole identity source (`user_details.supabase_id`, JIT-provisioned on first authenticated request via `supabaseAuth.service.js`). This is a live, working migration on `feat/supabase-auth-migration` (74 commits ahead of `main`), not a stub.
- **Orders**: `orders`, `order_items`, `order_status_history`, `payment_transactions` (Razorpay, immutable, webhook-dedup unique index), `return_requests` — all solid, keep the money-as-integer-minor-units convention everywhere new tables touch price.
- **Cart/Wishlist**: `cart_sessions`, `cart_items`, `wishlists` — keep the shape, fix the FK (see below).
- **Reviews, Coupons, Shipments, Notifications, Security log**: `reviews`, `coupons`, `coupon_uses`, `shipments`, `notifications`, `security_audit_log` — keep as-is.
- **Catalog root**: `brands`, `categories`, `products` — keep the integer PKs matching the original JSON ids (this convention is deliberate and documented in-schema; preserve it), but restructure what hangs off `products` (see below).

---

## Proposed Full Schema

### 1. Identity & Access (unchanged from current)
```
users              id uuid PK · firstName · lastName · username UNIQUE · email UNIQUE · phone · active · audit cols
user_details       id uuid PK · userId FK→users.id UNIQUE · supabaseId uuid UNIQUE · emailVerified · phoneVerified ·
                   blacklisted · authProvider · active · audit cols
user_addresses     id uuid PK · userId FK→users.id · fullName · phone · addressLine1/2 · landmark · city · state ·
                   postalCode · country · addressType · isDefault (partial-unique: one default per user) · active
roles              id uuid PK · code UNIQUE · name · description · active
user_roles         id uuid PK · userId FK→users.id · roleId FK→roles.id · assignedBy FK→users.id · UNIQUE(userId,roleId)
```

### 2. Catalog — brand/category root (unchanged)
```
brands             id integer PK · slug UNIQUE · name · description · image · sortOrder · active
categories         id integer PK · slug UNIQUE · name · type · description · image · parentId FK→categories.id (FIX: add real FK) ·
                   brandId FK→brands.id · sortOrder · specialPage · active
```

### 3. Catalog — products, now variant-first
Every purchasable line is a **variant**; a product with no real options gets exactly one implicit "default" variant. This is the standard normalized pattern (Shopify/Medusa use it) and resolves the current "sometimes has `variants[]`, sometimes doesn't" inconsistency in one move.

```
products                     id integer PK · slug UNIQUE · name · descriptionPrimary · descriptionSecondary ·
                              categoryId FK→categories.id · brandId FK→brands.id · manufacturer · warrantyText ·
                              catalogueFile · defaultImage · sortOrder · active · audit cols
                              (contentBlocks/frameVariants JSON blobs retired — replaced by tables below)

product_images                id uuid PK · productId FK→products.id · url · altText · sortOrder · isPrimary
product_specifications        id uuid PK · productId FK→products.id · label · value · sortOrder
product_package_contents      id uuid PK · productId FK→products.id · itemLabel · sortOrder
product_related               productId FK→products.id · relatedProductId FK→products.id · PK(productId, relatedProductId)

product_options                id uuid PK · productId FK→products.id · name (e.g. "Piston Size") ·
                               inputType enum(select|swatch|radio) · sortOrder
product_option_values          id uuid PK · optionId FK→product_options.id · label · code · hexColor nullable ·
                               priceModifierMinor default 0 · imageUrl nullable · sortOrder

product_variants               id uuid PK · productId FK→products.id · sku UNIQUE · priceMinor · currency ·
                               imageUrl · active
product_variant_option_values  variantId FK→product_variants.id · optionValueId FK→product_option_values.id ·
                               PK(variantId, optionValueId)

product_addons                 id uuid PK · productId FK→products.id · label · priceMinor · sku nullable · sortOrder
                               (independently-selectable extras — Salli's stretching-support/gas-cylinder/castor;
                                NOT a variant axis, becomes its own order line when chosen)

product_custom_fields          id uuid PK · productId FK→products.id · fieldKey · label · fieldType
                               enum(text|number|select|textarea|boolean) · options jsonb nullable · required ·
                               maxLength nullable · sortOrder
                               (captures working-distance select, prescription flag, engraving text prompts, etc.
                                — definitions only; captured values live on the order line, see §5)
```

### 4. Catalog — the Admetec frame system (structurally distinct: shared, reusable resources, not per-product options)
```
frames                        id uuid PK · name · priceModifierMinor · sortOrder · active
frame_colors                  id uuid PK · frameId FK→frames.id · name · hexColor (or array for two-tone) · imageUrl
product_frames                productId FK→products.id · frameId FK→frames.id · PK(productId, frameId)
                               (which frames a given loupe supports)
product_frame_color_images    productId FK→products.id · frameColorId FK→frame_colors.id · imageUrl ·
                               PK(productId, frameColorId)
                               (the actual rendered per-product-per-color photo — replaces the fragile
                                string-keyed "{frame}-{color}" map where keys didn't reliably match frames.json)
```

### 5. Inventory (keyed to variant, not product — every product has ≥1 variant now)
```
product_inventory             id uuid PK · variantId FK→product_variants.id UNIQUE · quantity · reservedQuantity ·
                              reorderPoint · version (optimistic lock) · updatedAt
                              CHECK(quantity>=0), CHECK(reservedQuantity>=0), CHECK(quantity>=reservedQuantity)
                              — keep exactly as today, just re-point the FK from product to variant
```
Zoho-sync reconciliation stays a **service-layer** decision (already explicitly flagged as deferred in `inventory.service.js`) — this doc doesn't force a shape for it, that's a separate call for whoever owns the Zoho integration.

### 6. Cart, Orders, Payments, Returns (unchanged shape, FK fixed)
```
cart_sessions      id uuid PK · userId FK→users.id UNIQUE · created/updated
cart_items         id uuid PK · cartId FK→cart_sessions.id · variantId FK→product_variants.id (FIX: was varchar productId, no FK) ·
                   quantity · unitPriceMinor snapshot · customValues jsonb (captured product_custom_fields answers) · updatedAt

orders             id uuid PK · userId FK→users.id · status · paymentStatus · razorpayOrderId/PaymentId ·
                   subtotal/tax/shippingFee/totalMinor · currency · shippingAddressId FK→user_addresses.id ·
                   notes · active · audit cols
order_items        id uuid PK · orderId FK→orders.id · variantId FK→product_variants.id (FIX: was varchar, no FK) ·
                   productNameSnapshot · brandSnapshot · skuSnapshot · quantity · unitPriceMinor · totalPriceMinor
order_item_custom_values   orderItemId FK→order_items.id · fieldKey · value · PK(orderItemId, fieldKey)
                           (what the customer actually typed/selected for each product_custom_fields prompt —
                            e.g. engraving text, working distance — snapshotted at purchase time)
order_status_history        id uuid PK · orderId FK→orders.id · fromStatus · toStatus · changedBy FK→users.id ·
                            reason · metadata jsonb · createdAt
payment_transactions        id uuid PK · orderId FK→orders.id (restrict) · razorpay ids · eventType · amountMinor ·
                            currency · status · gatewayResponse jsonb · metadata jsonb · processedAt · createdAt
                            (unique dedup on razorpayPaymentId+eventType — keep exactly as today)
return_requests              id uuid PK · orderId FK→orders.id · userId FK→users.id · reason · description · status ·
                             adminNotes · refundAmountMinor · processedBy FK→users.id · processedAt · created/updated
```

### 7. Wishlist & Reviews (product-level, not variant-level — matches how "add to wishlist"/"leave a review" actually works)
```
wishlists          id uuid PK · userId FK→users.id · productId FK→products.id (FIX: was varchar, no FK) ·
                   createdAt · UNIQUE(userId, productId)
reviews            id uuid PK · userId FK→users.id · productId FK→products.id (FIX: was varchar, no FK) ·
                   orderId FK→orders.id (nullable) · rating · title · body · verifiedPurchase · approved ·
                   active · audit cols · UNIQUE(userId, productId)
```

### 8. Coupons, Shipments, Notifications, Security (unchanged)
```
coupons            id uuid PK · code UNIQUE · type(percent|flat) · value · minOrderAmountMinor · maxUses ·
                   usedCount · perUserLimit · validFrom · validUntil · active
coupon_uses        id uuid PK · couponId FK→coupons.id · userId FK→users.id · orderId FK→orders.id (nullable) ·
                   discountAmountMinor · createdAt
shipments          id uuid PK · orderId FK→orders.id · awbNo · dtdcRefNo · carrier · status · labelUrl ·
                   trackingEvents · origin/destinationPincode · estimatedDelivery · shipped/deliveredAt · active
notifications      id uuid PK · userId FK→users.id · type · title · body · data · read · createdAt
security_audit_log id uuid PK · eventType · userId FK→users.id (nullable) · ipAddress · userAgent · requestId ·
                   metadata jsonb · createdAt
```

### 9. Leads — NEW, closes the confirmed zero-persistence gap
```
leads              id uuid PK · source enum(contact_form|product_quote|cart_quote) · name · email · phone · state ·
                   postcode · country · subject · message · productId FK→products.id (nullable) ·
                   variantId FK→product_variants.id (nullable) · status enum(new|contacted|converted|closed) ·
                   ipAddress · userAgent · emailSent boolean · createdAt
lead_cart_items    id uuid PK · leadId FK→leads.id · productName snapshot · sku snapshot · quantity · unitPriceMinor
                   (only populated for source=cart_quote, which can carry multiple lines — one lead → many rows)
```
This unifies all three current email-only flows (`contact.ts`, `productQuote.ts`, `quote.ts`) into one durably-persisted table with a `source` discriminator, and incidentally gives durable, cross-instance rate-limiting (query recent rows by `ipAddress`/`email`) to replace the in-memory `Map` that resets on every redeploy.

---

## Table count

**36 tables** in the fresh design vs. 23 today: 20 carried over unchanged, 3 fixed in place (FK added, no new table), 16 new (product normalization: 11, frame system: 4, leads: 2 — minus 1 overlap).

---

## Adoption strategy (expand → migrate → contract, not a hard cutover)

A hard cutover is not realistic here — `products.contentBlocks` etc. back the entire live storefront. Recommended path, phase-numbered to slot after the existing `[[feedback_architecture_policy]]` Phase references already in the code (which top out around Phase 8):

- **Phase 1 — Migration ledger baseline (prerequisite, blocks everything else).** Reconcile `drizzle/0001`–`0004` (hand-run, untracked) against the live DB: either retroactively generate matching snapshots so `drizzle-kit`'s journal reflects reality, or squash-and-rebaseline with the team's sign-off (this touches production DB state — **stop and ask before executing**, per the standing policy). Nothing below should be pushed until `drizzle-kit generate` produces a clean diff against what's actually live.
- **Phase 2 — Leads table.** Purely additive, zero risk to existing flows: add `leads`/`lead_cart_items`, wire `contact.ts`/`productQuote.ts`/`quote.ts` to insert before/alongside the existing email send. Ship this first — it's the highest-value, lowest-risk gap.
- **Phase 3 — Catalog normalization (additive phase).** Create the new product/variant/frame tables *alongside* the existing `products` JSON columns (don't drop anything yet). Write a one-way backfill script (same pattern as the existing `scripts/seed.js`) that reads `data/products.json` + `frames.json` and populates `product_options`/`product_variants`/`product_frames`/etc. Both representations coexist; nothing reads the new tables yet.
- **Phase 4 — FK repair on cart/order/wishlist/review.** Add the `variantId`/`productId` FK columns alongside the existing `varchar productId` columns, backfill by matching against the Phase 3 data, validate no orphans exist, *then* switch reads/writes over and drop the old varchar columns. This is the phase that actually fixes the Headlights bug's root cause — do this before `COMMERCE_ENABLED` ever flips to `true`.
- **Phase 5 — Frontend cutover.** Point `lib/catalog.ts` and the product detail/variant-selector components at the new normalized shape instead of `contentBlocks`/`frameVariants`. This is the biggest frontend-side effort in the plan and deserves its own dedicated planning pass when it's picked up — not detailed further here.
- **Phase 6 — Retire the JSON blob columns** (`products.contentBlocks`, `frameVariants`, `variants` source data) once Phase 5 is fully live and verified, plus retire `data/frames.json`/`headlights.json`/`medesy.json` in favor of the DB (or explicitly keep them as intentionally-static, non-transactional content — a call worth making explicitly rather than by default).

Each phase should end with the standing policy's existing reporting convention: changes made, files changed, tests run, verification results, remaining risks, next recommended phase. **Do not execute multiple phases in one sitting without explicit go-ahead per phase** — this mirrors the existing policy's phase-gating rule, which this plan continues rather than overrides.

---

## Verification (once implementation begins, per phase)

- Phase 1: `drizzle-kit generate` produces an empty/expected diff against the live DB; `drizzle-kit migrate` runs clean on a fresh throwaway DB from migration 0000 through the reconciled set.
- Phase 2: submit each of the 3 lead forms end-to-end; confirm a row lands in `leads` and (for cart_quote) `lead_cart_items`; confirm rate-limit queries hit the new table instead of the in-memory `Map`.
- Phase 3: backfill script run against a copy of `data/products.json`; spot-check that variant counts per product match the source `variants[]`/`frameVariants` counts exactly.
- Phase 4: query for orphaned `cart_items`/`order_items`/`wishlists`/`reviews` rows (FK violations) post-backfill — must be zero before dropping old columns.

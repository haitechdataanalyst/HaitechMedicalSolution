-- ============================================================
-- Migration 0003: Product media columns
-- Adds gallery/videos to products, and widens image columns to
-- text (Cloudinary CDN URLs run longer than the old local paths).
-- Safe to re-run: uses IF NOT EXISTS throughout.
-- ============================================================

ALTER TABLE brands ALTER COLUMN image TYPE text;
ALTER TABLE categories ALTER COLUMN image TYPE text;
ALTER TABLE products ALTER COLUMN default_image TYPE text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS videos jsonb;

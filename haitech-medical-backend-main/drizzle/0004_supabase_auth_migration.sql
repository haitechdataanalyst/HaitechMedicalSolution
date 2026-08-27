-- ============================================================
-- Migration 0004: Supabase as sole identity source (Phase 4)
-- Adds user_details.supabase_id — links a local users row to the
-- Supabase auth.users.id from a verified frontend session. Nullable:
-- pre-migration rows are linked lazily on first Supabase-authenticated
-- request, matched by email (see supabaseAuth.service.js).
-- Safe to re-run: uses IF NOT EXISTS / a guarded DO block throughout.
-- ============================================================

ALTER TABLE user_details ADD COLUMN IF NOT EXISTS supabase_id uuid;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_details_supabase_id_unique'
  ) THEN
    ALTER TABLE user_details ADD CONSTRAINT user_details_supabase_id_unique UNIQUE (supabase_id);
  END IF;
END $$;

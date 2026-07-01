-- ============================================================
-- Migration 0002: Production Hardening
-- Safe to re-run: uses IF NOT EXISTS / CONCURRENTLY throughout
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- SECTION 1: Critical Performance Indexes
-- ─────────────────────────────────────────────────────────────

-- orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;

-- order_items
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- cart_items / cart_sessions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_items_cart_session_id ON cart_items(cart_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_sessions_user_id ON cart_sessions(user_id);

-- wishlists
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_id ON wishlists(user_id);

-- reviews
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- notifications
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, read);

-- shipments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);

-- coupon_uses
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_uses_coupon_id ON coupon_uses(coupon_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_uses_user_id ON coupon_uses(user_id);
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_uses_unique ON coupon_uses(coupon_id, user_id) WHERE coupon_id IS NOT NULL;

-- products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active ON products(active) WHERE active = true;

-- user_details
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);

-- ─────────────────────────────────────────────────────────────
-- SECTION 2: Unique Constraints (prevent duplicate Razorpay IDs)
-- ─────────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_orders_razorpay_order_id'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT uq_orders_razorpay_order_id UNIQUE (razorpay_order_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_orders_razorpay_payment_id'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT uq_orders_razorpay_payment_id UNIQUE (razorpay_payment_id);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 3: Check Constraints
-- ─────────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_quantity'
  ) THEN
    ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity CHECK (quantity > 0);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_cart_items_quantity'
  ) THEN
    ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_coupons_discount'
  ) THEN
    ALTER TABLE coupons ADD CONSTRAINT chk_coupons_discount CHECK (value > 0);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 4: payment_transactions (immutable financial audit log)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payment_transactions (
  id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID           NOT NULL,
  razorpay_order_id    VARCHAR(100),
  razorpay_payment_id  VARCHAR(100),
  razorpay_signature   VARCHAR(512),
  event_type           VARCHAR(50)    NOT NULL,
  amount               INTEGER        NOT NULL,
  currency             VARCHAR(10)    NOT NULL DEFAULT 'INR',
  status               VARCHAR(50)    NOT NULL,
  gateway_response     JSONB          NOT NULL DEFAULT '{}',
  metadata             JSONB          NOT NULL DEFAULT '{}',
  processed_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_order_id
  ON payment_transactions(order_id);

CREATE INDEX IF NOT EXISTS idx_pt_razorpay_payment_id
  ON payment_transactions(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pt_event_type
  ON payment_transactions(event_type);

CREATE INDEX IF NOT EXISTS idx_pt_created_at
  ON payment_transactions(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pt_event_dedup
  ON payment_transactions(razorpay_payment_id, event_type)
  WHERE razorpay_payment_id IS NOT NULL;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_pt_order_id'
  ) THEN
    ALTER TABLE payment_transactions
      ADD CONSTRAINT fk_pt_order_id
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 5: order_status_history (audit trail for status changes)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_status_history (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID         NOT NULL,
  from_status  VARCHAR(50),
  to_status    VARCHAR(50)  NOT NULL,
  changed_by   UUID,
  reason       TEXT,
  metadata     JSONB        NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_osh_order_id
  ON order_status_history(order_id);

CREATE INDEX IF NOT EXISTS idx_osh_created_at
  ON order_status_history(created_at DESC);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_osh_order_id'
  ) THEN
    ALTER TABLE order_status_history
      ADD CONSTRAINT fk_osh_order_id
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_osh_changed_by'
  ) THEN
    ALTER TABLE order_status_history
      ADD CONSTRAINT fk_osh_changed_by
      FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 6: product_inventory (stock levels with optimistic locking)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_inventory (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        INTEGER      NOT NULL,
  quantity          INTEGER      NOT NULL DEFAULT 0,
  reserved_quantity INTEGER      NOT NULL DEFAULT 0,
  reorder_point     INTEGER      NOT NULL DEFAULT 10,
  version           INTEGER      NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_inventory_product_id UNIQUE (product_id),
  CONSTRAINT chk_inventory_quantity  CHECK (quantity >= 0),
  CONSTRAINT chk_inventory_reserved  CHECK (reserved_quantity >= 0),
  CONSTRAINT chk_inventory_available CHECK (quantity >= reserved_quantity)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id
  ON product_inventory(product_id);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_inventory_product_id'
  ) THEN
    ALTER TABLE product_inventory
      ADD CONSTRAINT fk_inventory_product_id
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 7: return_requests
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS return_requests (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID         NOT NULL,
  user_id       UUID         NOT NULL,
  reason        VARCHAR(100) NOT NULL,
  description   TEXT,
  status        VARCHAR(50)  NOT NULL DEFAULT 'pending',
  admin_notes   TEXT,
  refund_amount INTEGER,
  processed_by  UUID,
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_return_status CHECK (status IN ('pending', 'approved', 'rejected', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_returns_order_id
  ON return_requests(order_id);

CREATE INDEX IF NOT EXISTS idx_returns_user_id
  ON return_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_returns_status
  ON return_requests(status);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_returns_order_id'
  ) THEN
    ALTER TABLE return_requests
      ADD CONSTRAINT fk_returns_order_id
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_returns_user_id'
  ) THEN
    ALTER TABLE return_requests
      ADD CONSTRAINT fk_returns_user_id
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- SECTION 8: security_audit_log
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS security_audit_log (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   VARCHAR(100)  NOT NULL,
  user_id      UUID,
  ip_address   INET,
  user_agent   TEXT,
  request_id   VARCHAR(100),
  metadata     JSONB         NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sal_user_id
  ON security_audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_sal_event_type
  ON security_audit_log(event_type);

CREATE INDEX IF NOT EXISTS idx_sal_ip_address
  ON security_audit_log(ip_address);

CREATE INDEX IF NOT EXISTS idx_sal_created_at
  ON security_audit_log(created_at DESC);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_sal_user_id'
  ) THEN
    ALTER TABLE security_audit_log
      ADD CONSTRAINT fk_sal_user_id
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

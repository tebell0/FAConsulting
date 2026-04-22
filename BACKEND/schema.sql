-- ─────────────────────────────────────────────────────────────────
-- JayxCreatez Productions — MySQL Schema
-- Run once against the RDS instance to create all tables.
--
--   mysql -h <DB_HOST> -P 3306 -u admin -p faconsulting < schema.sql
-- ─────────────────────────────────────────────────────────────────

USE faconsulting;

-- ── Services ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          VARCHAR(20)   NOT NULL PRIMARY KEY,
  name        VARCHAR(60)   NOT NULL,
  duration    VARCHAR(20)   NOT NULL,
  price       INT           NOT NULL DEFAULT 0,
  description TEXT,
  sort_order  INT           NOT NULL DEFAULT 0
);

-- Seed default packages
INSERT IGNORE INTO services (id, name, duration, price, description, sort_order) VALUES
  ('svc-1', 'The Essentials', '30 min', 295,  'A focused 30-minute session delivering clean, editorial portraits with a curated selection of final images.', 1),
  ('svc-2', 'The Signature',  '1 hr',   345,  'An immersive 1-hour session with multiple looks, locations, and an expanded gallery of polished deliverables.', 2),
  ('svc-3', 'The Elite',      '2 hr',   427,  'A full 2-hour creative session — wardrobe styling consultation, premium retouching, and an extensive final gallery.', 3),
  ('svc-4', 'The Wedding',    '5 hr',   1500, 'Full-day wedding coverage from preparation to reception, beautifully documented and delivered.', 4);

-- ── Appointments ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id            VARCHAR(32)   NOT NULL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  initials      CHAR(3)       NOT NULL,
  package       VARCHAR(60)   NOT NULL,
  iso_date      DATE          NOT NULL,
  time          VARCHAR(12)   NOT NULL,
  location      VARCHAR(150)  NOT NULL DEFAULT '',
  badge         VARCHAR(20)   NOT NULL DEFAULT 'Pending',
  status        ENUM('upcoming','completed','delivered','cancelled') NOT NULL DEFAULT 'upcoming',
  email         VARCHAR(100)  NOT NULL DEFAULT '',
  phone         VARCHAR(20)   NOT NULL DEFAULT '—',
  session_type  VARCHAR(60)   NOT NULL DEFAULT '',
  notes         TEXT,
  ref           VARCHAR(20)   NOT NULL DEFAULT '',
  delivery_link     VARCHAR(255)  DEFAULT NULL,
  delivery_password VARCHAR(100)  DEFAULT NULL,
  delivery_token    VARCHAR(64)   DEFAULT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status   (status),
  INDEX idx_iso_date (iso_date)
);

-- ── Messages (contact form submissions) ───────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id           VARCHAR(32)  NOT NULL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  initials     CHAR(3)      NOT NULL,
  email        VARCHAR(100) NOT NULL DEFAULT '',
  phone        VARCHAR(20)  NOT NULL DEFAULT '',
  tag          VARCHAR(40)  NOT NULL DEFAULT 'Other',
  tag_class    VARCHAR(40)  NOT NULL DEFAULT 'msg-tag--other',
  body         TEXT         NOT NULL,
  inquiry_type VARCHAR(40)  NOT NULL DEFAULT 'other',
  is_read      TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read)
);

-- ── Settings (key-value store) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  `key`   VARCHAR(60) NOT NULL PRIMARY KEY,
  value   TEXT        NOT NULL
);

-- Seed default settings
INSERT IGNORE INTO settings (`key`, value) VALUES
  ('admin_email', 'jalen@jayxcreatez.com'),
  ('business_name', 'JayxCreatez Productions'),
  ('booking_window_days', '90');

-- ── Gallery items ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id          INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(120)  NOT NULL DEFAULT '',
  tag         VARCHAR(40)   NOT NULL DEFAULT '',
  src_url     VARCHAR(255)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Availability — fully blocked dates ────────────────────────────
CREATE TABLE IF NOT EXISTS availability_blocked_dates (
  iso_date DATE NOT NULL PRIMARY KEY
);

-- ── Availability — individually blocked time slots ─────────────────
CREATE TABLE IF NOT EXISTS availability_blocked_slots (
  iso_date  DATE        NOT NULL,
  slot      VARCHAR(12) NOT NULL,
  PRIMARY KEY (iso_date, slot)
);

-- ── Admin users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email         VARCHAR(100) NOT NULL DEFAULT ''
);

-- Default admin account.
-- password_hash is set via the admin settings page after first login.
-- Insert a hashed password here before running in production.
-- Example (bcrypt hash of a strong password):
--   INSERT IGNORE INTO admin_users (username, password_hash, email) VALUES
--     ('JayxCreatez', '<bcrypt_hash_here>', 'jalen@jayxcreatez.com');

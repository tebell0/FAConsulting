/**
 * queries.js
 * ─────────────────────────────────────────────────────────────────
 * All SQL query helpers for the JayxCreatez Productions backend.
 * Every function accepts the mysql2 pool and returns plain objects
 * that match the shapes the Vue frontend already expects.
 *
 * Tables assumed (MySQL):
 *
 *   appointments (
 *     id VARCHAR(32) PK,
 *     name VARCHAR(100), initials CHAR(3),
 *     package VARCHAR(32), iso_date DATE, time VARCHAR(12),
 *     location VARCHAR(150), badge VARCHAR(20),
 *     status ENUM('upcoming','completed','delivered','cancelled'),
 *     email VARCHAR(100), phone VARCHAR(20),
 *     session_type VARCHAR(60), notes TEXT,
 *     ref VARCHAR(20), delivery_link VARCHAR(255),
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   )
 *
 *   messages (
 *     id VARCHAR(32) PK,
 *     name VARCHAR(100), initials CHAR(3),
 *     email VARCHAR(100), phone VARCHAR(20),
 *     tag VARCHAR(40), tag_class VARCHAR(40),
 *     body TEXT, inquiry_type VARCHAR(40),
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   )
 *
 *   services (
 *     id VARCHAR(20) PK,
 *     name VARCHAR(60), duration VARCHAR(20),
 *     price INT, description TEXT,
 *     sort_order INT DEFAULT 0
 *   )
 *
 *   settings (
 *     key VARCHAR(60) PK,
 *     value TEXT
 *   )
 *
 *   gallery_items (
 *     id INT AUTO_INCREMENT PK,
 *     title VARCHAR(120), tag VARCHAR(40),
 *     src_url VARCHAR(255), sort_order INT DEFAULT 0,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   )
 *
 *   availability_blocked_dates (
 *     iso_date DATE PK
 *   )
 *
 *   availability_blocked_slots (
 *     iso_date DATE,
 *     slot VARCHAR(12),
 *     PRIMARY KEY (iso_date, slot)
 *   )
 * ─────────────────────────────────────────────────────────────────
 */

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Run a query on the mysql2 pool and return rows.
 * @param {import('mysql2/promise').Pool} pool
 * @param {string} sql
 * @param {any[]} [params]
 */
async function q(pool, sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}

/** Map a DB appointment row → frontend appointment shape */
function mapAppointment(row) {
  return {
    id:          row.id,
    name:        row.name,
    initials:    row.initials,
    package:     row.package,
    isoDate:     row.iso_date instanceof Date
                   ? row.iso_date.toISOString().slice(0, 10)
                   : String(row.iso_date).slice(0, 10),
    time:        row.time,
    location:    row.location,
    badge:       row.badge,
    status:      row.status,
    email:       row.email   || '',
    phone:       row.phone   || '—',
    sessionType: row.session_type || '',
    notes:       row.notes   || '—',
    ref:         row.ref     || '',
    link:        row.delivery_link || null,
  }
}

/** Map a DB message row → frontend message shape */
function mapMessage(row) {
  const d = new Date(row.created_at)
  const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return {
    id:       row.id,
    name:     row.name,
    initials: row.initials,
    email:    row.email  || '',
    phone:    row.phone  || '',
    tag:      row.tag,
    tagClass: row.tag_class,
    body:     row.body,
    meta:     `${row.tag} &nbsp;·&nbsp; ${dateStr} &nbsp;·&nbsp; ${timeStr}`,
  }
}

/** Map a DB service row → frontend service shape */
function mapService(row) {
  return {
    id:       row.id,
    name:     row.name,
    duration: row.duration,
    price:    row.price,
    desc:     row.description,
  }
}

// ── Appointments ──────────────────────────────────────────────────

export async function getAppointments(pool) {
  const rows = await q(pool, `
    SELECT * FROM appointments
    ORDER BY iso_date DESC, created_at DESC
  `)
  return rows.map(mapAppointment)
}

export async function getUpcomingAppointments(pool) {
  const rows = await q(pool, `
    SELECT * FROM appointments
    WHERE status = 'upcoming'
    ORDER BY iso_date ASC, time ASC
  `)
  return rows.map(mapAppointment)
}

export async function createAppointment(pool, data) {
  const {
    id, name, initials, package: pkg,
    isoDate, time, location, badge = 'Pending',
    email = '', phone = '—', sessionType = '', notes = '—', ref = '',
  } = data

  await q(pool, `
    INSERT INTO appointments
      (id, name, initials, package, iso_date, time, location, badge,
       status, email, phone, session_type, notes, ref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?, ?, ?, ?, ?)
  `, [id, name, initials, pkg, isoDate, time, location, badge,
      email, phone, sessionType, notes, ref])

  return { id }
}

export async function updateAppointmentStatus(pool, id, status) {
  await q(pool, `UPDATE appointments SET status = ? WHERE id = ?`, [status, id])
}

export async function updateDeliveryLink(pool, id, link, password = null) {
  await q(pool, `
    UPDATE appointments SET delivery_link = ?, delivery_password = ?, status = 'delivered' WHERE id = ?
  `, [link, password, id])
}

// ── Dashboard stats ───────────────────────────────────────────────

export async function getDashStats(pool) {
  const [totals] = await q(pool, `
    SELECT
      COUNT(*)                                               AS total,
      SUM(status = 'upcoming')                              AS upcoming,
      SUM(status = 'completed')                             AS completed,
      SUM(status = 'delivered')                             AS delivered,
      SUM(status = 'cancelled')                             AS cancelled
    FROM appointments
  `)

  const [revenue] = await q(pool, `
    SELECT
      COALESCE(SUM(s.price), 0) AS collected
    FROM appointments a
    JOIN services s ON s.name = a.package
    WHERE a.status IN ('completed', 'delivered')
  `)

  const [pending] = await q(pool, `
    SELECT COALESCE(SUM(s.price), 0) AS pending_amt
    FROM appointments a
    JOIN services s ON s.name = a.package
    WHERE a.status = 'upcoming'
  `)

  const [monthTotal] = await q(pool, `
    SELECT COALESCE(SUM(s.price), 0) AS month_total
    FROM appointments a
    JOIN services s ON s.name = a.package
    WHERE a.status IN ('completed', 'delivered')
      AND MONTH(a.iso_date)  = MONTH(CURDATE())
      AND YEAR(a.iso_date)   = YEAR(CURDATE())
  `)

  const unread = await q(pool, `
    SELECT COUNT(*) AS cnt FROM messages WHERE is_read = 0
  `)

  return {
    appointments: {
      total:     Number(totals.total),
      upcoming:  Number(totals.upcoming),
      completed: Number(totals.completed),
      delivered: Number(totals.delivered),
      cancelled: Number(totals.cancelled),
    },
    payments: {
      collected:  Number(revenue.collected),
      pendingAmt: Number(pending.pending_amt),
      monthTotal: Number(monthTotal.month_total),
      invoices:   Number(totals.total) - Number(totals.cancelled),
    },
    messages: {
      unread: Number(unread[0].cnt),
    },
  }
}

// ── Messages ──────────────────────────────────────────────────────

export async function getMessages(pool) {
  const rows = await q(pool, `
    SELECT * FROM messages ORDER BY created_at DESC
  `)
  return rows.map(mapMessage)
}

export async function createMessage(pool, data) {
  const {
    name, email, phone = '', inquiryType = 'other', message,
  } = data

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  const TAG_MAP = {
    reschedule: { tag: 'Reschedule',     tagClass: 'msg-tag--reschedule' },
    billing:    { tag: 'Billing',         tagClass: 'msg-tag--billing'    },
    additional: { tag: 'Additional Info', tagClass: 'msg-tag--info'       },
    location:   { tag: 'Location Change', tagClass: 'msg-tag--location'   },
    delivery:   { tag: 'Delivery',        tagClass: 'msg-tag--delivery'   },
    other:      { tag: 'Other',           tagClass: 'msg-tag--other'      },
  }
  const { tag, tagClass } = TAG_MAP[inquiryType] || TAG_MAP.other
  const id = 'msg-' + Date.now()

  await q(pool, `
    INSERT INTO messages (id, name, initials, email, phone, tag, tag_class, body, inquiry_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, name.trim(), initials, email, phone, tag, tagClass, message, inquiryType])

  return { id }
}

export async function markMessageRead(pool, id) {
  await q(pool, `UPDATE messages SET is_read = 1 WHERE id = ?`, [id])
}

// ── Services ──────────────────────────────────────────────────────

export async function getServices(pool) {
  const rows = await q(pool, `
    SELECT * FROM services ORDER BY sort_order ASC, id ASC
  `)
  return rows.map(mapService)
}

export async function upsertService(pool, svc) {
  const { id, name, duration, price, desc, sort_order = 0 } = svc
  await q(pool, `
    INSERT INTO services (id, name, duration, price, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      duration = VALUES(duration),
      price = VALUES(price),
      description = VALUES(description),
      sort_order = VALUES(sort_order)
  `, [id, name, duration, price, desc, sort_order])
}

export async function deleteService(pool, id) {
  await q(pool, `DELETE FROM services WHERE id = ?`, [id])
}

// ── Settings ──────────────────────────────────────────────────────

export async function getSettings(pool) {
  const rows = await q(pool, `SELECT \`key\`, value FROM settings`)
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

export async function upsertSettings(pool, updates) {
  // updates is a plain { key: value } object
  for (const [key, value] of Object.entries(updates)) {
    await q(pool, `
      INSERT INTO settings (\`key\`, value) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE value = VALUES(value)
    `, [key, String(value)])
  }
}

// ── Gallery ───────────────────────────────────────────────────────

export async function getGalleryItems(pool) {
  const rows = await q(pool, `
    SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC
  `)
  return rows.map(r => ({
    id:       r.id,
    title:    r.title,
    tag:      r.tag,
    src:      r.src_url,
  }))
}

// ── Availability ──────────────────────────────────────────────────

export async function getAvailability(pool) {
  const blockedDates = await q(pool, `
    SELECT iso_date FROM availability_blocked_dates
  `)
  const blockedSlots = await q(pool, `
    SELECT iso_date, slot FROM availability_blocked_slots
  `)

  // Build blockedTimes map: { 'YYYY-MM-DD': ['9:00 AM', ...] }
  const blockedTimes = {}
  for (const { iso_date, slot } of blockedSlots) {
    const key = iso_date instanceof Date
      ? iso_date.toISOString().slice(0, 10)
      : String(iso_date).slice(0, 10)
    if (!blockedTimes[key]) blockedTimes[key] = []
    blockedTimes[key].push(slot)
  }

  return {
    blockedDates: blockedDates.map(r =>
      r.iso_date instanceof Date
        ? r.iso_date.toISOString().slice(0, 10)
        : String(r.iso_date).slice(0, 10)
    ),
    blockedTimes,
  }
}

export async function saveAvailability(pool, { blockedDates = [], blockedTimes = {} }) {
  // Replace all blocked dates
  await q(pool, `DELETE FROM availability_blocked_dates`)
  for (const iso of blockedDates) {
    await q(pool, `INSERT IGNORE INTO availability_blocked_dates (iso_date) VALUES (?)`, [iso])
  }

  // Replace all blocked slots
  await q(pool, `DELETE FROM availability_blocked_slots`)
  for (const [iso, slots] of Object.entries(blockedTimes)) {
    for (const slot of slots) {
      await q(pool, `
        INSERT IGNORE INTO availability_blocked_slots (iso_date, slot) VALUES (?, ?)
      `, [iso, slot])
    }
  }
}

// ── Admin credentials ─────────────────────────────────────────────

export async function getAdminByUsername(pool, username) {
  const rows = await q(pool, `
    SELECT username, password_hash, email FROM admin_users WHERE username = ? LIMIT 1
  `, [username])
  return rows[0] || null
}

/**
 * routes/api.js
 * ─────────────────────────────────────────────────────────────────
 * Central API router — all routes backed by real DB queries.
 * ───────────────────────────────────────router.post("/admin/services", requireAdmin, async (req, res, next) => {
  try {
    const { name, duration, price, sort_order } = req.body;
    // Accept either 'desc' or 'description' from the client
    const desc = req.body.desc ?? req.body.description ?? '';
    // Auto-generate an id if the client didn't supply one
    const id = req.body.id || ('svc-' + Date.now());
    if (!name || !duration || price == null) {
      return res.status(400).json({ ok: false, error: "name, duration and price are required." });
    }
    await upsertService(getPool(), { id, name, duration, price, desc, sort_order });─────────────────
 */

import { Router } from "express";
import { testDatabaseConnection, getPool } from "../db.js";
import {
  getAppointments, getUpcomingAppointments, createAppointment,
  updateDeliveryLink, getDashStats, getMessages, createMessage,
  getServices, upsertService, deleteService,
  getSettings, upsertSettings, getGalleryItems,
  getAvailability, saveAvailability, getAdminByUsername,
} from "../queries.js";
import {
  getUploadUrl, getSignedDownloadUrl, deleteS3Object,
  buildFolderUrl, buildDeliveryPrefix,
} from "../s3.js";

const router = Router();

// ── Health ────────────────────────────────────────────────────────
router.get("/health", async (_req, res, next) => {
  try {
    const database = await testDatabaseConnection();
    res.json({ ok: true, api: "online", database: { ok: true, ...database } });
  } catch (err) {
    next(err);
  }
});

// ── Gallery ───────────────────────────────────────────────────────
router.get("/gallery", async (_req, res, next) => {
  try {
    const items = await getGalleryItems(getPool());
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

// ── Calendar — availability + booked slots ────────────────────────
router.get("/calendar", async (_req, res, next) => {
  try {
    const pool = getPool();
    const [availability, appointments] = await Promise.all([
      getAvailability(pool),
      getUpcomingAppointments(pool),
    ]);
    const bookedSlots = {};
    for (const a of appointments) {
      if (!bookedSlots[a.isoDate]) bookedSlots[a.isoDate] = [];
      bookedSlots[a.isoDate].push(a.time);
    }
    res.json({ ok: true, ...availability, bookedSlots });
  } catch (err) {
    next(err);
  }
});

// ── Calendar — submit a booking ───────────────────────────────────
router.post("/calendar/book", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, package: pkg, isoDate, time, location, sessionType, notes } = req.body;
    if (!firstName || !lastName || !email || !pkg || !isoDate || !time) {
      return res.status(400).json({ ok: false, error: "firstName, lastName, email, package, isoDate and time are required." });
    }
    const name     = `${firstName} ${lastName}`.trim();
    const initials = (firstName[0] + lastName[0]).toUpperCase();
    const ref      = "JXC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const id       = ref.toLowerCase();
    await createAppointment(getPool(), { id, name, initials, package: pkg, isoDate, time, location: location || "", badge: "Pending", email, phone: phone || "—", sessionType: sessionType || "", notes: notes || "—", ref });
    res.status(201).json({ ok: true, ref, id });
  } catch (err) {
    next(err);
  }
});

// ── Public services list ──────────────────────────────────────────
router.get("/services", async (_req, res, next) => {
  try {
    const services = await getServices(getPool());
    res.json({ ok: true, services });
  } catch (err) {
    next(err);
  }
});

// ── Contact form ──────────────────────────────────────────────────
router.post("/contact", async (req, res, next) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "name, email and message are required." });
    }
    const result = await createMessage(getPool(), { name, email, phone, inquiryType, message });
    res.status(201).json({ ok: true, id: result.id });
  } catch (err) {
    next(err);
  }
});

// ── Admin ─────────────────────────────────────────────────────────

/**
 * Simple middleware that checks for a valid admin session token.
 * Replace with a proper JWT / session strategy when ready.
 */
function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }
  next();
}

router.post("/admin/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "username and password are required." });
    }
    let authorized = false;
    try {
      const admin = await getAdminByUsername(getPool(), username);
      // NOTE: replace with bcrypt.compare() once password hashing is added
      authorized = !!admin && password === admin.password_hash;
    } catch {
      // admin_users table not yet created — fall back to env vars
      authorized = username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;
    }
    if (!authorized) {
      return res.status(401).json({ ok: false, error: "Invalid credentials." });
    }
    res.json({ ok: true, token: process.env.ADMIN_SECRET });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/dash", requireAdmin, async (_req, res, next) => {
  try {
    const pool = getPool();
    const [stats, appointments, messages] = await Promise.all([
      getDashStats(pool),
      getAppointments(pool),
      getMessages(pool),
    ]);
    res.json({ ok: true, stats, appointments, messages });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/messages", requireAdmin, async (_req, res, next) => {
  try {
    const messages = await getMessages(getPool());
    res.json({ ok: true, messages });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/deliverables", requireAdmin, async (_req, res, next) => {
  try {
    const deliverables = await getAppointments(getPool());
    res.json({ ok: true, deliverables });
  } catch (err) {
    next(err);
  }
});

router.put("/admin/deliverables/:id/link", requireAdmin, async (req, res, next) => {
  try {
    const { link } = req.body;
    if (!link) return res.status(400).json({ ok: false, error: "link is required." });
    await updateDeliveryLink(getPool(), req.params.id, link);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/services", requireAdmin, async (_req, res, next) => {
  try {
    const services = await getServices(getPool());
    res.json({ ok: true, services });
  } catch (err) {
    next(err);
  }
});

router.post("/admin/services", requireAdmin, async (req, res, next) => {
  try {
    const { id, name, duration, price, sort_order } = req.body;
    // Accept either 'desc' or 'description' from the client
    const desc = req.body.desc ?? req.body.description ?? '';
    if (!id || !name || !duration || price == null) {
      return res.status(400).json({ ok: false, error: "id, name, duration and price are required." });
    }
    await upsertService(getPool(), { id, name, duration, price, desc, sort_order });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.put("/admin/services/:id", requireAdmin, async (req, res, next) => {
  try {
    // Accept either 'desc' or 'description' from the client
    const desc = req.body.desc ?? req.body.description ?? '';
    await upsertService(getPool(), { id: req.params.id, ...req.body, desc });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/admin/services/:id", requireAdmin, async (req, res, next) => {
  try {
    await deleteService(getPool(), req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/settings", requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getSettings(getPool());
    res.json({ ok: true, settings });
  } catch (err) {
    next(err);
  }
});

router.put("/admin/settings", requireAdmin, async (req, res, next) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return res.status(400).json({ ok: false, error: "Body must be a JSON object." });
    }
    await upsertSettings(getPool(), updates);
    res.json({ ok: true, message: "Settings updated." });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/availability", requireAdmin, async (_req, res, next) => {
  try {
    const availability = await getAvailability(getPool());
    res.json({ ok: true, ...availability });
  } catch (err) {
    next(err);
  }
});

router.put("/admin/availability", requireAdmin, async (req, res, next) => {
  try {
    const { blockedDates, blockedTimes } = req.body;
    if (!Array.isArray(blockedDates) || typeof blockedTimes !== "object") {
      return res.status(400).json({ ok: false, error: "blockedDates (array) and blockedTimes (object) are required." });
    }
    await saveAvailability(getPool(), { blockedDates, blockedTimes });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── S3 — presigned upload URL ─────────────────────────────────────
/**
 * POST /api/admin/upload-url
 * Body: { appointmentId, fileName, contentType }
 * Returns: { ok, uploadUrl, key, publicUrl, folderUrl }
 *
 * The browser then PUTs the file bytes directly to `uploadUrl`.
 * After all files are uploaded, call PUT /admin/deliverables/:id/link
 * with `folderUrl` to record the delivery link.
 */
router.post("/admin/upload-url", requireAdmin, async (req, res, next) => {
  try {
    const { appointmentId, fileName, contentType } = req.body;
    if (!appointmentId || !fileName || !contentType) {
      return res.status(400).json({ ok: false, error: "appointmentId, fileName and contentType are required." });
    }
    // Sanitise fileName so it's safe for S3 key
    const safeName = fileName.replace(/[^a-zA-Z0-9._\-]/g, "_");
    const prefix   = buildDeliveryPrefix(appointmentId);
    const key      = `${prefix}${safeName}`;
    const result   = await getUploadUrl(key, contentType);
    res.json({
      ok:        true,
      uploadUrl: result.uploadUrl,
      key:       result.key,
      publicUrl: result.publicUrl,
      folderUrl: buildFolderUrl(prefix),
    });
  } catch (err) {
    next(err);
  }
});

// ── S3 — presigned download URL ───────────────────────────────────
/**
 * GET /api/admin/download-url?key=deliverables/jxc-001/photo.jpg
 * Returns a short-lived signed GET URL for a private object.
 */
router.get("/admin/download-url", requireAdmin, async (req, res, next) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ ok: false, error: "key query param is required." });
    const url = await getSignedDownloadUrl(key);
    res.json({ ok: true, url });
  } catch (err) {
    next(err);
  }
});

// ── S3 — delete an object ─────────────────────────────────────────
/**
 * DELETE /api/admin/s3-object
 * Body: { key }
 */
router.delete("/admin/s3-object", requireAdmin, async (req, res, next) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ ok: false, error: "key is required." });
    await deleteS3Object(key);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

/**
 * routes/api.js
 * ─────────────────────────────────────────────────────────────────
 * Central API router.
 * Mount sub-routers here as the project grows.
 *
 * Current routes:
 *   GET  /api/health          → DB + API status
 *   GET  /api/gallery         → gallery items (stub)
 *   GET  /api/calendar        → bookings / available slots (stub)
 *   POST /api/contact         → contact form submission (stub)
 *   POST /api/admin/signin    → admin authentication (stub)
 *   GET  /api/admin/dash      → dashboard data (stub, protected)
 *   GET  /api/admin/deliverables → deliverables list (stub, protected)
 *   GET  /api/admin/settings  → settings (stub, protected)
 *   PUT  /api/admin/settings  → update settings (stub, protected)
 * ─────────────────────────────────────────────────────────────────
 */

import { Router } from "express";
import { testDatabaseConnection } from "../db.js";

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
    // TODO: fetch gallery items from DB
    res.json({ ok: true, items: [] });
  } catch (err) {
    next(err);
  }
});

// ── Calendar / Bookings ───────────────────────────────────────────
router.get("/calendar", async (_req, res, next) => {
  try {
    // TODO: fetch available slots / bookings from DB
    res.json({ ok: true, slots: [] });
  } catch (err) {
    next(err);
  }
});

// ── Contact form ──────────────────────────────────────────────────
router.post("/contact", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "name, email and message are required." });
    }
    // TODO: save to DB and/or send email
    res.status(201).json({ ok: true, message: "Message received." });
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
    // TODO: validate credentials against DB
    // Stub: accept any credentials and return a token placeholder
    res.json({ ok: true, token: process.env.ADMIN_SECRET || "replace-me" });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/dash", requireAdmin, async (_req, res, next) => {
  try {
    // TODO: fetch dashboard summary data from DB
    res.json({ ok: true, stats: {} });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/deliverables", requireAdmin, async (_req, res, next) => {
  try {
    // TODO: fetch deliverables from DB
    res.json({ ok: true, deliverables: [] });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/settings", requireAdmin, async (_req, res, next) => {
  try {
    // TODO: fetch settings from DB
    res.json({ ok: true, settings: {} });
  } catch (err) {
    next(err);
  }
});

router.put("/admin/settings", requireAdmin, async (req, res, next) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ ok: false, error: "Request body must be a JSON object." });
    }
    // TODO: persist settings to DB
    res.json({ ok: true, message: "Settings updated." });
  } catch (err) {
    next(err);
  }
});

export default router;

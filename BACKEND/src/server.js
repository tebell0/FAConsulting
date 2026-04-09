import "dotenv/config";
import cors from "cors";
import express from "express";
import apiRouter from "./routes/api.js";

const app = express();
const port = Number(process.env.PORT || 3001);

// ── Allowed origins ───────────────────────────────────────────────
// Comma-separated list in FRONTEND_ORIGIN, e.g.:
//   FRONTEND_ORIGIN=http://localhost:5173,https://yourdomain.com
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// ── CORS ──────────────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
    credentials: true,
  })
);

// Handle preflight requests for all routes (Express 5 wildcard syntax)
app.options("/{*path}", cors());

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API routes ────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ── 404 handler ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err.message || "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});

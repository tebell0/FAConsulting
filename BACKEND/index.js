import "dotenv/config";
import cors from "cors";
import express from "express";
import {
  testDatabaseConnection,
  insertSubmission,
  listSubmissions,
} from "./src/db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    const database = await testDatabaseConnection();
    res.json({
      ok: true,
      api: "online",
      database: {
        ok: true,
        ...database,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      api: "online",
      database: {
        ok: false,
        error: error.message,
      },
    });
  }
});

app.post("/api/submissions", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: "name, email, and message are required",
    });
  }

  try {
    const submission = await insertSubmission({ name, email, message });
    res.status(201).json({ ok: true, submission });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/submissions", async (_req, res) => {
  try {
    const submissions = await listSubmissions();
    res.json({ ok: true, submissions });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
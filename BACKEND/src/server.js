import "dotenv/config";
import cors from "cors";
import express from "express";
import { testDatabaseConnection } from "./db.js";

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

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

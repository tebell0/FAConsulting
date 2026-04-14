/**
 * seed-admin.js
 * ─────────────────────────────────────────────────────────────
 * Hashes the admin password with bcrypt and updates admin_users.
 * Run once from the BACKEND directory:   node seed-admin.js
 * ─────────────────────────────────────────────────────────────
 */

import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const ADMIN_USERNAME = "JayxCreatez";
const ADMIN_PASSWORD = "CIS4375!";
const ADMIN_EMAIL    = "jalen@jayxcreatez.com";
const SALT_ROUNDS    = 10;

async function seed() {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl:      process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  console.log("Connected to database.");

  // Ensure table exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username      VARCHAR(60)  NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      email         VARCHAR(100) NOT NULL DEFAULT ''
    )
  `);
  console.log("Table 'admin_users' ready.");

  // Hash password with bcrypt
  const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  console.log("Password hashed successfully.");

  // Insert or update
  await connection.execute(
    `INSERT INTO admin_users (username, password_hash, email)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), email = VALUES(email)`,
    [ADMIN_USERNAME, hash, ADMIN_EMAIL]
  );

  console.log(`\nAdmin user seeded:`);
  console.log(`  Username: ${ADMIN_USERNAME}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Hash:     ${hash}`);
  console.log(`\nThe plain-text password in schema.sql has been replaced with a bcrypt hash.`);

  await connection.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

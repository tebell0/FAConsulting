import pg from "pg";
import mysql from "mysql2/promise";

const { Pool } = pg;

function getConfig() {
  const {
    DB_CLIENT = "mysql",
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_SSL = "true",
  } = process.env;

  return {
    client: DB_CLIENT.toLowerCase(),
    host: DB_HOST,
    port: Number(DB_PORT || (DB_CLIENT.toLowerCase() === "mysql" ? 3306 : 5432)),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: DB_SSL === "true",
  };
}

function validateConfig(config) {
  const missing = Object.entries({
    DB_HOST: config.host,
    DB_PORT: config.port,
    DB_NAME: config.database,
    DB_USER: config.user,
    DB_PASSWORD: config.password,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing database environment variables: ${missing.join(", ")}`);
  }
}

let pgPool;
let mysqlPool;

function getPgPool(config) {
  if (!pgPool) {
    pgPool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    });
  }
  return pgPool;
}

function getMysqlPool(config) {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      waitForConnections: true,
      connectionLimit: 10,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    });
  }
  return mysqlPool;
}

export function getPool() {
  const config = getConfig();
  validateConfig(config);
  if (config.client === "postgres") return getPgPool(config);
  if (config.client === "mysql") return getMysqlPool(config);
  throw new Error('Unsupported DB_CLIENT. Use "postgres" or "mysql".');
}

export async function testDatabaseConnection() {
  const config = getConfig();
  validateConfig(config);

  if (config.client === "postgres") {
    const pool = getPgPool(config);
    const result = await pool.query("SELECT NOW() AS connected_at");
    return {
      client: "postgres",
      connectedAt: result.rows[0].connected_at,
    };
  }

  if (config.client === "mysql") {
    const pool = getMysqlPool(config);
    const [rows] = await pool.query("SELECT NOW() AS connected_at");
    return {
      client: "mysql",
      connectedAt: rows[0].connected_at,
    };
  }

  throw new Error('Unsupported DB_CLIENT. Use "postgres" or "mysql".');
}


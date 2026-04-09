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

/**
 * Returns the active connection pool.
 * Call after testDatabaseConnection() has been invoked at least once
 * so the pool is already initialised.
 */
export function getPool() {
  const { DB_CLIENT = 'mysql' } = process.env
  if (DB_CLIENT.toLowerCase() === 'postgres') return pgPool
  return mysqlPool
}

export async function testDatabaseConnection() {
  const config = getConfig();
  validateConfig(config);

  if (config.client === "postgres") {
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

    const result = await pgPool.query("SELECT NOW() AS connected_at");
    return {
      client: "postgres",
      connectedAt: result.rows[0].connected_at,
    };
  }

  if (config.client === "mysql") {
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

    const [rows] = await mysqlPool.query("SELECT NOW() AS connected_at");
    return {
      client: "mysql",
      connectedAt: rows[0].connected_at,
    };
  }

  throw new Error('Unsupported DB_CLIENT. Use "postgres" or "mysql".');
}

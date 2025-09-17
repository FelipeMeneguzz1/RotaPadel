require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no .env");
}

const sql = neon(process.env.DATABASE_URL);

async function pingDB() {
  const result = await sql`SELECT version(), NOW() as now`;
  return { version: result[0].version, now: result[0].now };
}

module.exports = { sql, pingDB };

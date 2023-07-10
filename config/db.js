const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
})

const poolAlive = async () => {
  const tm = await pool.query('SELECT NOW()');

  if (tm.rowCount == 1)
    console.log('PostgreSQL Pool=ACTIVE |', (tm.rows[0].now))
}

module.exports = { pool, poolAlive };


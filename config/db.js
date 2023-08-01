const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const { Pool } = require('pg')

// const pool = new Pool({
//   host: process.env.POSTGRES_HOST_LOCAL,
//   user: process.env.POSTGRES_USER_LOCAL,
//   password: process.env.POSTGRES_PASSWORD_LOCAL,
//   port: process.env.POSTGRES_PORT_LOCAL,
//   database: process.env.POSTGRES_DB_LOCAL,
// })

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

const poolAlive = async () => {
  try {
    const tm = await pool.query('SELECT NOW()');

    if (tm.rowCount == 1) {
      console.log('PostgreSQL=ACTIVE |', (tm.rows[0].now))
      process.send('ready')
    }
  } catch (error) {
    console.error({ ...error })
    process.exit(0);
  }
}

module.exports = { pool, poolAlive };


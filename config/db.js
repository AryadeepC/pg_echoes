const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const { Pool } = require('pg')
const { createClient } = require("redis");

// const redisClient = createClient();
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 1000),
    connectTimeout: 10 * 1000,
  }
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

const poolAlive = async () => {
  try {
    const tm = await pool.query('SELECT NOW()');
    if (tm.rowCount == 1) {
      console.log('PostgreSQL=ONLINE |', (tm.rows[0].now))
      process.send('ready')
    }
  } catch (error) {
    // console.error({ ...error })
    await pool.end()
    console.error('PostgreSQL Client Error', error.code, error.errno)
    process.exit(0);
  }
  finally {
    console.log(" -- PGSQL -- ".padStart(10));
  }
}

const redisStat = async () => {
  try {
    await redisClient.connect();
    console.log("redis=ONLINE");
  } catch (error) {
    console.error('Redis Client Error', error);
  } finally {
    console.log(" -- REDIS -- ".padStart(10));
  }
}

module.exports = { pool, poolAlive, redisClient, redisStat };
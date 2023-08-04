const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
if (process.env.NODE_ENV !== "production") {
  require("console-stamp")(console, "[HH:MM:ss.l]");
}
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes.js");
const schedule = require('node-schedule');
const { pool, poolAlive, redisClient, redisStat } = require("./config/db.js");
const { firebaseConfig } = require("./config/firebase.js");
const { initializeApp } = require("firebase/app");
const { dbDump } = require("./config/cron-dump.js");

app.use(express.static(path.join(__dirname, "/public")));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/", router);
poolAlive();
redisStat();
initializeApp(firebaseConfig);


const pokeCacheAndDB = schedule.scheduleJob('* 2 * * * *', async () => {
  try {
    await redisClient.set("creator", "arc")
    console.log(await redisClient.get("creator"))
    const tiempo = await pool.query('SELECT NOW()');
    console.log(tiempo.rowCount ? tiempo.rows[0].now : "nil")
  } catch (error) {
    console.error("poke", error.message)
  }
  // dbJob.cancel();
});
const dbJob = schedule.scheduleJob('* 59 23 * * *', async () => {
  dbDump();
  // dbJob.cancel();
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server=https://echoes-api.onrender.com");
});

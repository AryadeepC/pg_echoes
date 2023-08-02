const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
require("console-stamp")(console, "[HH:MM:ss.l]");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes.js");
const schedule = require('node-schedule');
const { pool, poolAlive, redisClient } = require("./config/db.js");
const { firebaseConfig } = require("./config/firebase.js");
const { initializeApp } = require("firebase/app");
const { dbDump } = require("./config/cron-dump.js");

// app.use(express.static("/public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/", router);
poolAlive();
// redisStat()
initializeApp(firebaseConfig);


const dbJob = schedule.scheduleJob('* 59 23 * * *', async () => {
  dbDump();
  // dbJob.cancel();
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server=https://echoes-api.onrender.com");
});

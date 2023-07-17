const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
require("console-stamp")(console, "[HH:MM:ss.l]");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes.js");
const { pool, poolAlive } = require("./config/db.js");
const { firebaseConfig } = require("./config/firebase.js");
const { initializeApp } = require("firebase/app");



// app.use(express.static("/public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/", router);
poolAlive();
initializeApp(firebaseConfig);

// const val = pool.query(`SELECT * FROM users;`).then(val => console.log(val.rows));

app.listen(process.env.PORT || 8000, () => {
  console.log("server=https://echoes-api.onrender.com");
});

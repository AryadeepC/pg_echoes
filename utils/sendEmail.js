const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const nodemailer = require("nodemailer");

const crypto = require("crypto");
const uid = crypto.randomBytes(3).toString("hex");

// console.log(uid)

let transporter = nodemailer.createTransport({
  host: process.env.TRANSPORT_HOST,
  port: process.env.TRANSPORT_PORT,
  secure: false,
  encryption: process.env.TRANSPORT_ENCRYPTION,
  auth: {
    user: process.env.TRANSPORT_USER,
    pass: process.env.TRANSPORT_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

let mailBody =
  `<br><br><div style="border:1px solid rgb(192, 183, 183, 0.35);text-align:center;width:500px; margin:5px auto;">
<div style="height:75px;background-color:seashell; border:1px solid rgb(192, 183, 183, 0.65);">
  <div class="adM">
  </div><img src="https://iili.io/H6scmAJ.jpg" title="Echoes" style="height:50px; width:150px; margin-top: 12.5px;" alt="logo">
</div>
<div style="height:120px;background-color:white">
  <div
      style="text-align:left;padding-left:20px; padding-top: 25px; padding-bottom: 10px; font-weight:bold;font-family:'Inter',sans-serif; font-size: 20px;">
      Verify your email address
  </div>
  <div style="font-size:12px;text-align:justify; padding: 0 20px 0 20px; font-family:'Inter',sans-serif;">
      Please enter the following code to reset your password. If you don't want to reset your password, ignore this message.
  </div>
</div>
<div style="margin-top: 10px;background-color:white">
  <div style="font-size:13px;font-family:'Inter',sans-serif; font-weight: 700; ">Verification code
  </div>
  <div style="font-weight:700;font-size:35px; padding-top: -2px; font-family:'Inter',sans-serif">${uid}</div>
</div>
<div>
  <div
      style="text-align:justify;font-size:11px;color:rgba(97,85,85,0.77);padding:25px 20px;border-top:1px solid rgb(192, 183, 183, 0.85);font-family:'Inter',sans-serif";  background-color: seashell;>
      Echoes will never ask you to disclose or
      verify your
      password, credit card, or banking account number.
  </div>
</div>
</div><br>` + "Regards, Team Echoes";

module.exports = { transporter, mailBody, uid };

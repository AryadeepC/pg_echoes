require("dotenv").config({ path: __dirname + "../../config.env" });
const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");
const { transporter, mailBody, uid } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

bcrypt.compare("e55106", "$2a$08$O2cC9rnZMrSlp2Kq4K3dj.w2Myw5HIcQF/j7vtkOVlZo12YmYdNCC").then(res => {
  console.log(res);
}).catch(err => console.error(err.message));

const forgotPassword = async (req, res) => {
  try {
    const foundUser = await pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [req.userId]);
    if (!foundUser.rowCount) {
      return Err(req, res, "User not found");
    }
    const userEmail = foundUser.rows[0].email;

    let mailOptions = {
      from: `Echoes <${process.env.TRANSPORT_USER}>`,
      to: userEmail,
      subject: "Verfication mail for password reset from Echoes",
      html: mailBody,
    };
    console.log("OG RESET TOKEN=", uid);
    const otp = await bcrypt.hash(uid, 8);

    const userWithCode = await pool.query('UPDATE users SET reset_password_token = $1,reset_password_expiry = $2 WHERE id = $3 RETURNING *;', [otp, Date.now() + 2 * 60 * 1000, req.userId])
    console.log("hashed verif code=", userWithCode.rows[0].reset_password_token);

    const emailResponse = await transporter.sendMail(mailOptions);
    console.log("emails", emailResponse.accepted);

    if (emailResponse.rejected.length === 0) {
      console.log("Email sent successfully");
      return res.send({
        status: "ok",
        message: "Email sent successfully",
      });
    }
  } catch (error) {
    return Err(req, res, error.message);
  }
};

const resetPassword = async (req, res) => {
  console.log("USER=", req.userId);
  const { code = "", password = "" } = req.body;
  if (!code || !password)
    return Err(req, res, "Missing credentials in reset password");

  try {
    const hashedpassword = await bcrypt.hash(password, 8);
    const foundUser = await pool.query('SELECT reset_password_token, reset_password_expiry FROM users WHERE id = $1', [req.userId])
    if (!foundUser.rowCount) {
      return Err(req, res, "User not found");
    }
    if (foundUser.rows[0].reset_password_expiry < Date.now()) {
      return Err(req, res, "Code Expired !!");
    }
    console.log("ENTERED RESET TOKEN=", code);
    const isMatch = await bcrypt.compare(code, foundUser.rows[0].reset_password_token);
    if (!isMatch) {
      return Err(req, res, "Verification Code Mismatch !!");
    }

    const newUser = await pool.query('UPDATE users SET password = $1,reset_password_token = NULL, reset_password_expiry = NULL WHERE id = $2 RETURNING *;', [hashedpassword, req.userId]);
    console.log(newUser.rowCount ? "PASSWORD CHANGED" : "COULDN'T CHANGE PASSWORD");

    return res.send({
      status: "ok",
      message: "Password reset successfully!",
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};



module.exports = { forgotPassword, resetPassword };

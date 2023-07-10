require("dotenv").config({ path: __dirname + "../../config.env" });
const { userModel } = require("../../models/User");
const { Err } = require("../../utils/ErrorResponse");
const { transporter, mailBody, uid } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

const forgotPassword = async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.userId);
    if (!foundUser) {
      return Err(req, res, "User not found");
    }
    const userEmail = foundUser.email;

    let mailOptions = {
      from: `Echoes <${process.env.TRANSPORT_USER}>`,
      to: userEmail,
      subject: "Verfication mail for password reset from Echoes",
      html: mailBody,
    };

    const otp = await bcrypt.hash(uid, 8);
    const userWithCode = await userModel.findByIdAndUpdate(
      req.userId,
      {
        resetPasswordToken: otp,
        resetPasswordExpiry: Date.now() + 2 * 60 * 1000,
      },
      { new: true }
    );
    console.log("hashed verif code=", userWithCode.resetPasswordToken);

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
  const { code = "", password = "" } = req.body;
  if (!code || !password)
    return Err(req, res, "Missing credentials in reset password");

  try {
    const hashedpassword = await bcrypt.hash(password, 8);
    const foundUser = await userModel.findById(req.userId);
    if (!foundUser) {
      return Err(req, res, "User not found");
    }
    if (foundUser.resetPasswordExpiry < Date.now()) {
      return Err(req, res, "Code Expired !!");
    }
    const isMatch = await bcrypt.compare(foundUser.resetPasswordToken, code);
    if (!isMatch) {
      return Err(req, res, "Verification Code Mismatch !!");
    }

    const newUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        password: hashedpassword,
      },
      { new: true }
    );
    console.log(newUser);

    return res.send({
      status: "ok",
      message: "Password reset successfully!",
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = { forgotPassword, resetPassword };

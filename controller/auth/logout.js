const logoutController = async (req, res) => {
  res.cookie("userToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  console.log("🍘:", req.cookies);
  res.send({ status: "ok", message: "user logged out" });
};

module.exports = { logoutController };

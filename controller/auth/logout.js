const logoutController = async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  console.log("🍘:", req.cookies);
  res.send({ status: "ok", message: "user logged out" });
};

module.exports = { logoutController };

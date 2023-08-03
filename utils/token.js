const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const jwt = require("jsonwebtoken");
const { pool, redisClient } = require("../config/db");
const { Err } = require("./ErrorResponse");


const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRY,
        algorithm: "HS256"
    });

}
const signRefreshToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRY,
        algorithm: "HS256"
    });
    try {
        await redisClient.set(payload.id, token, {
            EX: 45 * 24 * 60 * 60
        });
    } catch (error) {
        return Err(req, res, error.message)
    }
    return token;
}

const regenTokens = async (req, res, refreshToken) => {
    const decodedRefreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decodedRefreshPayload.id || !decodedRefreshPayload.name)
        return Err(req, res, "invalid token");

    const dbUser = await pool.query('SELECT username FROM users WHERE id = $1', [decodedRefreshPayload.id]);
    if (!dbUser.rowCount || dbUser.rows[0].username !== decodedRefreshPayload.name) {
        return Err(req, res, "invalid token");
    }

    const payload = { id: decodedRefreshPayload.id, name: decodedRefreshPayload.name }
    const accToken = signAccessToken(payload);
    const refToken = await signRefreshToken(payload);

    res.cookie("accessToken", accToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    res.cookie("refreshToken", refToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    return payload;
}


module.exports = { signAccessToken, signRefreshToken, regenTokens }
const rateLimit = require("express-rate-limit")

const authLimit = rateLimit({ // 5 per hour
    windowMs: 60 * 60 * 1000, // in milliseconds
    max: 5, // Limit each IP to make requests per `window` 
    statusCode: 429,
    // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // legacyHeaders: true, // Disable the `X-RateLimit-*` headers
    message: "Registration Limit EXCEEDED",
    skipFailedRequests: true // failed requests are ignored
})

const fetchLimit = rateLimit({ // 60 per minute
    windowMs: 60 * 1000, // in milliseconds
    max: 60, // Limit each IP to make requests per `window` 
    statusCode: 429,
    // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // legacyHeaders: true, // Disable the `X-RateLimit-*` headers
    message: "GET Limit EXCEEDED",
    skipFailedRequests: true // failed requests are ignored
})

const postLimit = rateLimit({ // 240 per day
    windowMs: 24 * 60 * 60 * 1000, // in milliseconds
    max: 480, // Limit each IP to make requests per `window` 
    statusCode: 429,
    // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // legacyHeaders: true, // Disable the `X-RateLimit-*` headers
    message: "CONTENT UPLOAD Limit EXCEEDED",
    skipFailedRequests: true // failed requests are ignored
})

const demoLimit = rateLimit({ // 240 per day
    windowMs: 10 * 1000, // in milliseconds
    max: 3, // Limit each IP to make requests per `window` 
    statusCode: 429,
    // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // legacyHeaders: true, // Disable the `X-RateLimit-*` headers
    message: "Rate Limit EXCEEDED",
    skipFailedRequests: true // failed requests are ignored
})


module.exports = { authLimit, fetchLimit, postLimit, demoLimit }
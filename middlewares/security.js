const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// 请求频率限制
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP限制100次请求
    standardHeaders: true,
    legacyHeaders: false
});

// 人机验证中间件
const recaptchaMiddleware = (req, res, next) => {
    const token = req.headers['x-recaptcha-token'];
    if (!token) return res.status(403).json({ code: 403, error: "需要人机验证" });

    // 调用Google reCAPTCHA验证
    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`)
        .then(r => r.json())
        .then(data => data.success ? next() : res.status(403).json({ code: 403, error: "验证失败" }));
};

// module.exports = { apiLimiter, recaptchaMiddleware };
export { apiLimiter, recaptchaMiddleware };

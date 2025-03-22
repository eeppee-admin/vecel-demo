import { RateLimiterMemory } from 'rate-limiter-flexible';

const hybridLimiter = new RateLimiterMemory({
  points: 100, // 每秒令牌数
  duration: 1,
  inMemoryBlockOnConsumed: 150, // 突发流量缓冲
  execEvenly: true
});

export default async (req, res, next) => {
  try {
    await hybridLimiter.consume(req.ip);
    next();
  } catch (e) {
    res.status(429).json({
      code: 429,
      message: '请求过于频繁',
      retryAfter: e.msBeforeNext / 1000
    });
  }
}
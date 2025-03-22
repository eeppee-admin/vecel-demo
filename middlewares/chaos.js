export const injectFailure = (probability = 0.05) => {
  return (req, res, next) => {
    if (Math.random() < probability) {
      // 模拟服务不可用
      res.status(503).json({ 
        code: 503,
        message: '混沌工程触发服务降级'
      });
      return;
    }
    
    // 模拟延迟
    const delay = Math.floor(Math.random() * 500);
    setTimeout(next, delay);
  };
};
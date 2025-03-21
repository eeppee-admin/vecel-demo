const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// 跨域中间件
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/', async (req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), 5000);
    });
    
    const apiResponse = await Promise.race([
      fetch('https://api.52vmy.cn/api/video/girl', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }),
      timeoutPromise
    ]);

    if (!apiResponse.ok) throw new Error(`API请求失败，状态码：${apiResponse.status}`);
    const data = await apiResponse.json();

    // 完整HTML模板
    res.set('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>视频播放</title>
        <style>
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            background-color: #f0f0f0;
          }
          video {
            max-width: 90%;
            max-height: 90%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <video controls autoplay loop muted playsinline>
          <source src="${data.data?.video || data.video}" type="video/mp4">
          您的浏览器不支持视频播放，请使用现代浏览器
        </video>
      </body>
      </html>
    `);
    
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
      request_url: req.originalUrl,
      timestamp: new Date().toISOString(),
      tip: "问题反馈请加用户群"
    });
  }
});

module.exports = router;
import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

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
      fetch('https://api.52vmy.cn/api/music/wy/rand'),
      timeoutPromise
    ]);

    if (!apiResponse.ok) throw new Error(`API请求失败，状态码：${apiResponse.status}`);
    const { data } = await apiResponse.json();

    res.set('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>音乐播放</title>
        <style>
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            background: #f0f0f0;
          }
          .player {
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          audio { width: 300px; }
        </style>
      </head>
      <body>
        <div class="player">
          <audio controls autoplay>
            <source src="${data.Music}" type="audio/mpeg">
            您的浏览器不支持音频播放
          </audio>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
      request_url: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
});

// - Replace const ... = require() with import ... from
// - Change module.exports = router to export default router
export default router;
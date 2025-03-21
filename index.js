const express = require('express');
const app = express();

// 健康检查端点
app.get('/', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// 随机数据接口
app.get('/api/random', (req, res) => {
    res.json({
        randomNumber: Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString()
    });
});

// 新增视频接口（调用第三方API）
app.get('/api/videos', async (req, res) => {
  try {
    const apiResponse = await fetch('https://api.52vmy.cn/api/video/girl', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API请求失败，状态码：${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();
    
    // 直接返回HTML播放页面
    res.set('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>视频播放</title>
        <style>
          body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          video { max-width: 90%; max-height: 90%; }
        </style>
      </head>
      <body>
        <video controls autoplay loop>
          <source src="${data.data?.video || data.video}" type="video/mp4">
          您的浏览器不支持视频播放
        </video>
      </body>
      </html>
    `);
    
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
      tip: "问题反馈请加用户群"
    });
  }
});

// Vercel 需要导出serverless实例
if (process.env.VERCEL_ENV) {
    module.exports = app;
} else {
    // 本地运行添加监听
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`本地服务运行在 http://localhost:${PORT}`);
    });
}


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


router.get('/yule', async (req, res) => {
  try {
    console.log('开始请求视频API');
    const apiResponse = await fetch('https://api.52vmy.cn/api/video/yule', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!apiResponse.ok) {
      console.error('API响应异常:', await apiResponse.text());
      return res.status(502).send('视频服务连接失败');
    }

    const responseData = await apiResponse.json();
    console.log('完整API响应:', JSON.stringify(responseData, null, 2));

    // 增强数据验证逻辑
    const videoUrl = responseData.data?.video ||
      responseData.url ||
      responseData.data?.url;

    if (responseData.code === 200 && videoUrl) {
      res.send(`
        <video controls autoplay style="max-width:100%; height:100vh">
          <source src="${videoUrl}" type="video/mp4">
        </video>
      `);
    } else {
      console.error('无效的API响应结构:', {
        code: responseData.code,
        receivedKeys: Object.keys(responseData)
      });
      res.status(502).send(`视频服务异常，错误代码：${responseData.code || '无状态码'}`);
    }
  } catch (error) {
    console.error('视频路由错误:', error.stack);
    res.status(500).send(`服务器内部错误: ${error.message}`);
  }
});

// 新增热点视频端点
router.get('/redian', async (req, res) => {
  try {
    const apiResponse = await Promise.race([
      fetch('https://api.52vmy.cn/api/video/redian', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000))
    ]);

    if (!apiResponse.ok) throw new Error(`API请求失败: ${apiResponse.status}`);
    const responseData = await apiResponse.json();

    // 多播放器模板
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>热点视频联播</title>
      </head>
      <body>
        <div class="video-grid">
          <video controls autoplay muted>
            <source src="${responseData.data.video}" type="video/mp4">
          </video>
          <!-- 可在此添加更多视频源 -->
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    res.status(500).send(`视频加载失败: ${error.message}`);
  }
});

module.exports = router;
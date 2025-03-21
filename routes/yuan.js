const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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
            fetch('https://api.52vmy.cn/api/img/tu/yuan'),
            timeoutPromise
        ]);

        if (!apiResponse.ok) throw new Error(`API请求失败，状态码：${apiResponse.status}`);
        const { data } = await apiResponse.json();

        res.set('Content-Type', 'text/html');
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>二次元图片</title>
        <style>
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            background: #f0f0f0;
          }
          img {
            max-width: 90%;
            max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <img src="${data.url || data.imgUrl}" alt="随机二次元图片">
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

module.exports = router;
// 这个接口废了
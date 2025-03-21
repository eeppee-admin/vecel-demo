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


const express = require('express');
const app = express();
require('dotenv').config();

// 引入路由文件
const videoRouter = require('./routes/videos');
const tiangouRouter = require('./routes/tiangou');
const musicRouter = require('./routes/music');
const userRouter = require('./routes/user');
const medicineRouter = require('./routes/medicine');
const patientRouter = require('./routes/patient');
const queueRouter = require('./routes/queue');
const eroticRouter = require('./routes/erotic');
const emailRouter = require('./routes/email');
// 基础端点
app.get('/', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/random', (req, res) => {
    res.json({
        randomNumber: Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString()
    });
});

// 新增JSON解析中间件
app.use(express.json());

// 路由分配
app.use('/api/videos', videoRouter);
app.use('/api/tiangou', tiangouRouter);
app.use('/app/music', musicRouter);


// 新增用户数据路由
app.use('/app/user', userRouter);
app.use('/app/medicine', medicineRouter);
app.use('/app/patient', patientRouter);
app.use('/app/queue', queueRouter);
app.use('/app/erotic', eroticRouter);
app.use('/app/email', emailRouter);

// 服务器配置
if (process.env.VERCEL_ENV) {
    module.exports = app;
} else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`服务运行中: http://localhost:${PORT}`);
    });
}


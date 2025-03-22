import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import morgan from 'morgan';


// 引入路由文件，引入方式迁移到import
import videoRouter from './routes/videos.js';
import tiangouRouter from './routes/tiangou.js';
import musicRouter from './routes/music.js';
import userRouter from './routes/user.js';

import medicineRouter from './routes/medicine.js';
import patientRouter from './routes/patient.js';
import queueRouter from './routes/queue.js';
import eroticRouter from './routes/erotic.js';
import emailRouter from './routes/email.js';
import imageRouter from './routes/image.js';
import animeRouter from './routes/anime.js';
import hospitalRouter from './routes/hospital.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';


// 上面是依赖


const app = express();



// 基础端点
app.get('/', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});



// 会话配置
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(':method :url :status - :response-time ms'));
// 新增JSON解析中间件
app.use(express.json());

// 维梦api路由分配
app.use('/app/video', videoRouter);
app.use('/app/tiangou', tiangouRouter);
app.use('/app/music', musicRouter);
app.use('/app/image', imageRouter);
app.use('/app/anime', animeRouter);
// app.use('/app/translate', translateRouter);
// 新增用户数据路由
if (false) {

    app.use('/api/users', usersRouter);
}
app.use('/api/hospital', hospitalRouter);
app.use('/app/user', userRouter);
app.use('/app/medicine', medicineRouter);
app.use('/app/patient', patientRouter);
app.use('/app/queue', queueRouter);
app.use('/app/erotic', eroticRouter);
app.use('/app/email', emailRouter);
// 引入认证路由


app.use('/app/auth', authRouter);

// 新增文件上传路由，仅在开发环境下启用
if (false) {
    const fileRouter = require('./routes/file');
    app.use('/app/file', fileRouter);
    // 在服务器配置前添加静态目录：
    // 在已有静态目录配置下添加
    // http://localhost:3000/uploads/a.txt 当uploads有文件时才加载内容
    app.use('/uploads', express.static('public/uploads'));
    // http://localhost:3000/file-manager
    app.use('/file-manager', express.static('public/file-manager'));
    // http://localhost:3000/games/snake/index.html
    app.use('/games', express.static(path.join(__dirname, 'public/games')));
}







// Vercel服务器配置
if (process.env.VERCEL_ENV) {
    module.exports = app;
} else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 服务运行中: http://localhost:${PORT}`);
    });
}



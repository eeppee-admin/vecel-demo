import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fetch from 'node-fetch';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { OAuth2Client } from 'google-auth-library';




const Strategy = GoogleStrategy.Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();


// 配置Passport
// 修改为新的认证策略配置
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/app/auth/google/callback", // 完整路径
    passReqToCallback: true,
    accessType: 'offline'
},
    (req, accessToken, refreshToken, profile, done) => {
        console.log('Google profile:', profile);
        return done(null, profile);
    }
));

// 序列化用户
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// 登录入口
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

// 回调处理
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: true
    }),
    (req, res) => {
        res.redirect('/app/auth/profile');
    }
);

// 获取用户信息
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ code: 401, error: "未登录" });
    }
    res.json({
        code: 200,
        data: {
            id: req.user.id,
            name: req.user.displayName,
            email: req.user.emails[0].value,
            photo: req.user.photos[0].value
        }
    });
});

// 退出登录
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});



// 添加各平台处理逻辑
const handleOAuthLogin = async (provider, code) => {
    switch (provider) {
        case 'google':
            return await handleGoogle(code);
        case 'facebook':
            return await handleFacebook(code);
        case 'apple':
            return await handleApple(code);
        default:
            throw new Error('不支持的登录方式');
    }
};

// Google验证示例

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function handleGoogle(code) {
    const ticket = await googleClient.verifyIdToken({
        idToken: code,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
}


async function handleFacebook(code) {
    const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?
        client_id=${process.env.FB_CLIENT_ID}&
        client_secret=${process.env.FB_CLIENT_SECRET}&
        code=${code}&
        redirect_uri=${encodeURIComponent(process.env.FB_REDIRECT_URI)}`);

    const { access_token } = await response.json();
    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`);
    return userRes.json();
}

// // Apple验证示例（需要额外配置）
// const jwt = require('jsonwebtoken');
// async function handleApple(code) {
//     const clientSecret = jwt.sign({
//         iss: process.env.APPLE_TEAM_ID,
//         iat: Math.floor(Date.now() / 1000),
//         exp: Math.floor(Date.now() / 1000) + 86400 * 180,
//         aud: 'https://appleid.apple.com',
//         sub: process.env.APPLE_CLIENT_ID
//     }, process.env.APPLE_PRIVATE_KEY, { algorithm: 'ES256' });

//     const res = await fetch('https://appleid.apple.com/auth/token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//             grant_type: 'authorization_code',
//             code,
//             client_id: process.env.APPLE_CLIENT_ID,
//             client_secret: clientSecret,
//             redirect_uri: process.env.APPLE_REDIRECT_URI
//         })
//     });
//     return res.json();
// }

// // 新增通用第三方登录接口
// router.post('/mobile/login', async (req, res) => {
//     const { provider, authCode } = req.body; // provider: google/facebook/apple

//     try {
//         // 根据provider选择验证策略
//         const userInfo = await handleOAuthLogin(provider, authCode);

//         // 生成应用自己的访问令牌
//         const appToken = generateAppToken(userInfo);

//         res.json({
//             code: 200,
//             data: {
//                 token: appToken,
//                 user: {
//                     id: userInfo.uid,
//                     name: userInfo.name,
//                     avatar: userInfo.photo
//                 }
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ code: 500, error: error.message });
//     }
// });
export default router;

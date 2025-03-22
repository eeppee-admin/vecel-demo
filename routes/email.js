import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();
import nodemailer from 'nodemailer';
import crypto from 'crypto';


// 内存存储验证码（生产环境建议使用Redis）
const codeStorage = new Map();

// 创建邮件传输器（需配置QQ邮箱SMTP信息）
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: "1690544550@qq.com",
        pass: "lirewmtxdkdceegi"
    }
});

// 发送页面
router.get('/', (req, res) => {
    res.send(`
        <style>
            .container { max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; }
            input { width: 70%; padding: 8px; margin-right: 5px; }
            button { padding: 8px 15px; background: #007bff; border: none; color: white; }
        </style>
        <div class="container">
            <h2>邮箱验证</h2>
            <input type="email" id="email" placeholder="请输入邮箱地址">
            <button onclick="sendCode()">发送验证码</button>
            <p id="message" style="color:#666;margin-top:10px"></p>
            <script>
                async function sendCode() {
                    const email = document.getElementById('email').value;
                    const response = await fetch('/app/email/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const result = await response.json();
                    document.getElementById('message').textContent = result.msg;
                }
            </script>
        </div>
    `);
});

// 发送验证码接口
router.post('/send', async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ code: 400, msg: "邮箱格式不正确" });
    }

    // 生成6位数字验证码
    const code = crypto.randomInt(100000, 999999).toString();
    const lastSent = codeStorage.get(email)?.timestamp;

    // 限制60秒内重复发送
    if (lastSent && Date.now() - lastSent < 60000) {
        return res.json({ code: 429, msg: "请勿频繁发送验证码" });
    }

    try {
        await transporter.sendMail({
            from: '"验证码服务" <1690544550@qq.com>',
            to: email,
            subject: '您的验证码',
            text: `验证码：${code}，5分钟内有效`
        });

        codeStorage.set(email, { code, timestamp: Date.now() });
        res.json({ code: 200, msg: "验证码已发送，请查收邮箱" });
    } catch (error) {
        console.error('邮件发送失败:', error);
        res.status(500).json({ code: 500, msg: "邮件发送失败" });
    }
});

export default router;
import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// 生成模拟心率数据（24小时平均）
function generateHeartRate() {
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * (100 - 60) + 60));
}

// 生成模拟用户数据（100条）
function generateMockUsers() {
    return Array.from({ length: 100 }, (_, index) => {
        const baseNumber = index + 1;
        return {
            email: `user${baseNumber}@example.com` || "default@example.com",
            phone: `13${Math.floor(Math.random() * 10 ** 9).toString().padStart(9, '0')}`, // 确保11位手机号
            password: `$2b$10$${Math.random().toString(36).slice(2, 22)}`.padEnd(60, '0'), // 保证固定长度
            deviceIMEI: Math.floor(1e14 + Math.random() * 9e14).toString().slice(0, 15).padStart(15, '0'), // 补全15位
            imageUrl: `https://picsum.photos/200/300?random=${baseNumber}`,
            age: Math.floor(Math.random() * 50 + 18) || 18, // 默认18岁
            heartRate: generateHeartRate() // 使用心率函数
        };
    });
}
router.get('/', (req, res) => {
    res.json({
        code: 200,
        data: generateMockUsers(),
        timestamp: new Date().toISOString()
    });
});

export default router;
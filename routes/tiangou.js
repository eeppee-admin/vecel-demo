import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

// 舔狗日记接口
router.get('/', async (req, res) => {
    try {
        const apiResponse = await fetch('https://api.52vmy.cn/api/wl/yan/tiangou', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        if (!apiResponse.ok) throw new Error(`API请求失败，状态码：${apiResponse.status}`);
        const data = await apiResponse.json();

        res.json({
            code: 200,
            data: data.data || data,
            message: "请求成功"
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: error.message });
    }
});

export default router;
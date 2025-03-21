const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/bilibili', async (req, res) => {
    try {
        const response = await axios.get('https://api.bilibili.com/x/web-interface/popular/series/one?number=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.bilibili.com/',
                'Cookie': 'buvid3=XXXXXX;' // 添加基础cookie
            },
            timeout: 5000
        });

        // 兼容不同版本的API响应结构
        const dataList = response.data?.data?.list ||
            response.data?.data?.archives ||
            [];

        if (dataList.length === 0) {
            throw new Error('空数据列表');
        }

        res.json({
            code: 200,
            data: dataList.map(item => ({
                title: item.title || item.name,
                url: item.short_link || `https://www.bilibili.com/video/${item.bvid}`,
                cover: (item.pic || item.cover)?.replace(/^http:/, 'https:')
            }))
        });
    } catch (error) {
        console.error('B站API请求失败:', {
            message: error.message,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({
            code: 500,
            error: '获取数据失败',
            tip: '请尝试以下方案：1. 更新Cookie 2. 切换网络环境 3. 等待10分钟后重试'
        });
    }
});

module.exports = router;
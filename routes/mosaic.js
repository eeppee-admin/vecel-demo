const express = require('express');
const router = express.Router();
const Jimp = require('jimp');

// 这个文件遇到error, 暂时抛弃
// 生成抽象色块马赛克
router.get('/', async (req, res) => {
    try {
        const imgSize = 200;
        const blockSize = 10;

        // 创建抽象画布 // 在创建画布时添加await
        const image = await Jimp.create(imgSize, imgSize, 0xFFFFFFFF);

        // 生成随机暖色调色块
        for (let y = 0; y < imgSize; y += blockSize) {
            for (let x = 0; x < imgSize; x += blockSize) {
                // 修改颜色生成逻辑
                const r = Math.min(255, Math.max(0, Math.random() > 0.3 ? 200 + Math.random() * 55 : 0));
                const g = Math.min(255, Math.max(0, Math.random() > 0.5 ? 100 + Math.random() * 155 : 0));
                const b = Math.min(255, Math.max(0, Math.random() > 0.7 ? 150 + Math.random() * 105 : 0));
                const color = Jimp.rgbaToInt(r, g, b, 255);
                image.scan(x, y, blockSize, blockSize, function (px, py, idx) {
                    this.bitmap.data.writeUInt32BE(color, idx, true);
                });
            }
        }

        // 设置响应头
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-store');

        // 输出图片
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            res.send(buffer);
        });

    } catch (error) {
        console.error('图像生成失败详情:', error);
        res.status(500).send('艺术创作失败: ' + error.message);
    }
});

module.exports = router;
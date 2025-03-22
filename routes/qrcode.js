const express = require('express');
const router = express.Router();
const qr = require('qr-image');
const { URL } = require('url');

// IMEI验证正则（15位数字）
const IMEI_REGEX = /^\d{15}$/;

router.get('/:imei', (req, res) => {
    try {
        const imei = req.params.imei;

        // 验证IMEI格式
        if (!IMEI_REGEX.test(imei)) {
            return res.status(400).json({
                code: 400,
                error: "IMEI格式不正确，应为15位纯数字"
            });
        }

        // 生成二维码
        const qr_png = qr.imageSync(imei, {
            type: 'png',
            ec_level: 'H',
            size: 10,
            margin: 2
        });

        // 设置响应头
        res.set({
            'Content-Type': 'image/png',
            'Content-Length': qr_png.length,
            'Cache-Control': 'public, max-age=86400'
        });

        res.send(qr_png);

    } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
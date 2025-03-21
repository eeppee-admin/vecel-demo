const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Redis缓存中间件
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl;
        client.get(key, (err, data) => {
            if (data) {
                res.send(JSON.parse(data));
            } else {
                const originalSend = res.send;
                res.send = (body) => {
                    client.setex(key, duration, body);
                    originalSend.call(res, body);
                };
                next();
            }
        });
    };
};

// 图片优化接口示例
const sharp = require('sharp');
router.get('/optimize-image', async (req, res) => {
    const { url, width=300, quality=80 } = req.query;
    const imageBuffer = await fetch(url).then(r => r.buffer());
    
    sharp(imageBuffer)
        .resize(Number(width))
        .jpeg({ quality: Number(quality) })
        .toBuffer((err, data) => {
            res.type('image/jpeg').send(data);
        });
});
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../public/uploads');
!fs.existsSync(uploadDir) && fs.mkdirSync(uploadDir, { recursive: true });

// 配置multer存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// 在原有配置基础上新增以下内容
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB限制
});

// 修改分块上传接口
router.post('/chunk', upload.single('chunk'), (req, res) => {
    try {
        const { index, total, hash, filename } = req.body;
        const chunkDir = path.join(uploadDir, 'temp', hash);

        // 确保目录存在且具有权限
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir, {
                recursive: true,
                mode: 0o755 // 添加目录权限
            });
        }

        // 使用复制+删除代替直接重命名
        const finalPath = path.join(chunkDir, index);
        fs.copyFileSync(req.file.path, finalPath);
        fs.unlinkSync(req.file.path); // 删除临时文件

        res.json({
            code: 200,
            progress: ((index + 1) / total * 100).toFixed(1) + '%'
        });
    } catch (error) {
        console.error('分块上传失败:', error);
        res.status(500).json({ code: 500, error: '文件操作失败' });
    }
});

// 新增文件夹上传支持
router.post('/folder', upload.array('files'), (req, res) => {
    const filePaths = req.files.map(file => ({
        original: file.originalname,
        saved: file.filename
    }));
    res.json({ code: 200, data: filePaths });
});

// 修改合并接口
router.post('/merge', express.json(), (req, res) => {
    try {
        const { hash, filename } = req.body;
        const chunkDir = path.join(uploadDir, 'temp', hash);

        // 添加目录存在性检查
        if (!fs.existsSync(chunkDir)) {
            return res.status(400).json({
                code: 400,
                error: '分块不存在或已过期'
            });
        }
        const chunks = fs.readdirSync(chunkDir).sort((a, b) => a - b);

        // 合并文件
        const writeStream = fs.createWriteStream(path.join(uploadDir, filename));
        chunks.forEach(chunk => {
            writeStream.write(fs.readFileSync(path.join(chunkDir, chunk)));
        });
        writeStream.end();

        // 清理临时文件
        fs.rmSync(chunkDir, { recursive: true });

        res.json({ code: 200, url: `/uploads/${filename}` });
    } catch (error) {
        console.error('文件合并失败:', error);
        res.status(500).json({ code: 500, error: '文件合并失败' });
    }
})

// 在文件路由中添加文件列表接口
router.get('/list', (req, res) => {
    const files = fs.readdirSync(uploadDir)
        .filter(file => !file.startsWith('.')) // 过滤隐藏文件
        .map(file => ({
            name: file,
            size: fs.statSync(path.join(uploadDir, file)).size,
            url: `/uploads/${file}`
        }));
    res.json(files);
});

// 修改普通文件上传接口
router.post('/', upload.single('file'), (req, res) => {
    res.json({  // 修改原来的重定向为返回JSON
        code: 200,
        url: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
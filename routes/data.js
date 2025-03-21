const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// 文件上传配置
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// 上传到S3
router.post('/upload', upload.single('file'), async (req, res) => {
    const s3Client = new S3Client({ region: 'auto' });
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    });
    
    await s3Client.send(command);
    res.json({ url: `https://${process.env.R2_PUBLIC_URL}/${command.input.Key}` });
});

// 数据备份接口
router.post('/backup', async (req, res) => {
    const backupFile = `backup-${Date.now()}.sql`;
    // 执行数据库备份命令
    exec(`mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASS} ${process.env.DB_NAME} > ${backupFile}`);
    // 上传到云存储
    await uploadToCloud(backupFile);
    res.json({ code: 200, file: backupFile });
});
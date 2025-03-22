import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.get('/girl', async (req, res) => {
    try {
        const response = await fetch('https://api.52vmy.cn/api/img/tu/girl');
        const data = await response.json();

        if (data.code === 200 && data.url) {
            // 返回完整的HTML页面
            res.send(`
                <!DOCTYPE html>
                <html style="height:100%">
                <head>
                    <title>图片展示</title>
                    <style>
                        body { 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            height: 100vh;
                            margin: 0;
                            background: #f0f2f5;
                        }
                        img { 
                            max-width: 90%; 
                            max-height: 80vh; 
                            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                            border-radius: 8px;
                        }
                        button {
                            margin-top: 20px;
                            padding: 10px 20px;
                            background: #1a73e8;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <img src="${data.url}" alt="随机图片">
                    <button onclick="location.reload()">换一张</button>
                </body>
                </html>
            `);
        } else {
            res.status(502).send(`
                <h1 style="color:red">服务不可用</h1>
                <p>上游接口返回异常数据</p>
            `);
        }
    } catch (error) {
        res.status(500).send(`
            <h1 style="color:red">服务器错误</h1>
            <p>${error.message}</p>
        `);
    }
});


export default router;
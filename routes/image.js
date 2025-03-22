const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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


// 在现有路由后添加新接口
router.get('/proxy', async (req, res) => {
    try {
        const { type } = req.query;
        const apiUrl = `https://porn-image1.p.rapidapi.com/?type=${type || 'pussy'}`;

        // 代理请求到第三方API
        const response = await fetch(apiUrl, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'porn-image1.p.rapidapi.com'
            }
        });
        const data = await response.json(); // 新增响应解析

        // 验证响应数据
        if (!data || !data.url) { // 新增数据校验
            throw new Error('无效的图片数据');
        }

        // 生成展示页面
        res.send(`
            <!DOCTYPE html>
            <html style="height:100%">
            <head>
                <title>图片展示 - ${type || 'pussy'}</title>
                <style>
                    /* 保持原有样式不变 */
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
                <img src="${data.url}" alt="代理图片"> <!-- 修改为使用返回的url -->
                <button onclick="location.reload()">换一张</button>
            </body>
            </html>
        `);

    } catch (error) {
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>错误提示</title></head>
            <body>
                <h1 style="color:red">图片加载失败</h1>
                <p>${error.message}</p>
                <button onclick="history.back()">返回</button>
            </body>
            </html>
        `);
    }
});

router.get('/nude', async (req, res) => {
    try {
        const { type = 'boobs' } = req.query;
        const apiUrl = 'https://girls-nude-image.p.rapidapi.com/';

        // 调用第三方API
        const response = await fetch(apiUrl, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'girls-nude-image.p.rapidapi.com'
            }
        });
        const { success, url } = await response.json();

        if (!success || !url) {
            throw new Error('接口返回数据异常');
        }

        // 生成展示页面
        res.send(`
            <!DOCTYPE html>
            <html style="height:100%">
            <head>
                <title>Girls图片 - ${type}</title>
                <style>
                    /* 保持原有样式一致 */
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
                <img src="${url}" alt="${type}图片">
                <button onclick="location.reload()">换一张</button>
            </body>
            </html>
        `);

    } catch (error) {
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>错误提示</title></head>
            <body>
                <h1 style="color:red">图片加载失败</h1>
                <p>${error.message}</p>
                <button onclick="history.back()">返回</button>
            </body>
            </html>
        `);
    }
});

module.exports = router;
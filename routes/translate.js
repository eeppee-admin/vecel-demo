const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
        // 生成基础HTML结构
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>即时翻译工具</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
                    .translator-box { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                    textarea { width: 100%; height: 100px; margin: 10px 0; }
                    button { background: #1a73e8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
                    #result { margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="translator-box">
                    <h2>即时翻译工具</h2>
                    <textarea id="inputText" placeholder="输入中文内容..."></textarea>
                    <button onclick="translate()">立即翻译</button>
                    <div id="result"></div>
                </div>
                <script>
                    async function translate() {
                        const input = document.getElementById('inputText').value;
                        const resultDiv = document.getElementById('result');
                        
                        if (!input) {
                            resultDiv.innerHTML = '<p style="color:red">请输入要翻译的内容</p>';
                            return;
                        }

                        resultDiv.innerHTML = '<p>翻译中...</p>';
                        
                        try {
                            const response = await fetch('/app/translate/api?text=' + encodeURIComponent(input));
                            const data = await response.json();
                            
                            if (data.translation) {
                                resultDiv.innerHTML = \`
                                    <p><strong>原文：</strong>${data.original}</p>
                                    <p><strong>译文：</strong>${data.translation}</p>
                                \`;
                            } else {
                                resultDiv.innerHTML = '<p style="color:red">翻译失败</p>';
                            }
                        } catch (error) {
                            resultDiv.innerHTML = '<p style="color:red">服务器连接失败</p>';
                        }
                    }
                </script>
            </body>
            </html>
        `;

        // 如果存在查询参数则进行翻译
        if (req.query.text) {
            const apiResponse = await fetch(`https://api.52vmy.cn/api/query/fanyi/youdao?msg=${encodeURIComponent(req.query.text)}`);
            const responseData = await apiResponse.json(); // 重命名变量避免冲突

            if (responseData.code === 200) {
                return res.json({
                    original: responseData.data.source,
                    translation: responseData.data.target
                });
            }
            return res.status(502).json({ error: '翻译服务不可用' });
        }

        res.send(htmlContent);
    } catch (error) {
        res.status(500).send(`
            <h1 style="color:red">服务器错误</h1>
            <p>${error.message}</p>
        `);
    }
});

module.exports = router;
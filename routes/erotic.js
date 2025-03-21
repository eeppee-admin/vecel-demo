const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// // 艺术化词汇库
// const metaphors = {
//     subjects: ['月光', '潮汐', '蝴蝶', '玫瑰露', '丝绸'],
//     verbs: ['缠绕', '浸没', '叩击', '融化', '潮涌'],
//     adverbs: ['缓缓地', '炽烈地', '绵密地', '跌宕地']
// };

// // 生成隐喻式短句
// function generatePoeticSentence() {
//     const templates = [
//         () => `${metaphors.subjects[Math.floor(Math.random() * 5)]} ${metaphors.adverbs[Math.floor(Math.random() * 4)]} ${metaphors.verbs[Math.floor(Math.random() * 5)]}`,
//         () => `如同${metaphors.subjects[Math.floor(Math.random() * 5)]}般的 ${metaphors.verbs[Math.floor(Math.random() * 5)]}`,
//         () => `在${metaphors.subjects[Math.floor(Math.random() * 5)]}与${metaphors.subjects[Math.floor(Math.random() * 5)]}之间 ${metaphors.verbs[Math.floor(Math.random() * 5)]}`
//     ];

//     return templates[Math.floor(Math.random() * 3)]();
// }

// 雌小鬼风格词汇库
const metaphors = {
    subjects: ['杂鱼', '笨蛋', '废物', '下仆', '猪头'],
    verbs: ['跪下', '舔鞋', '踩在脚下', '嘲笑', '捉弄'],
    adverbs: ['嚣张地', '得意洋洋地', '不屑地', '贱兮兮地'],
    suffixes: ['~', '♪', '！', '...', '？']
};

// 生成雌小鬼风格句式
function generatePoeticSentence() {
    const templates = [
        () => `${metaphors.subjects[Math.floor(Math.random() * 5)]}先生${metaphors.suffixes[Math.floor(Math.random() * 5)]}还不快${metaphors.verbs[Math.floor(Math.random() * 5)]}`,
        () => `就凭你这${metaphors.subjects[Math.floor(Math.random() * 5)]}${metaphors.suffixes[Math.floor(Math.random() * 5)]}连○○○都做不到吗${metaphors.suffixes[Math.floor(Math.random() * 5)]}`,
        () => `${metaphors.adverbs[Math.floor(Math.random() * 4)]}${metaphors.verbs[Math.floor(Math.random() * 5)]}的${metaphors.subjects[Math.floor(Math.random() * 5)]}最讨厌了${metaphors.suffixes[Math.floor(Math.random() * 5)]}`
    ];

    return templates[Math.floor(Math.random() * 3)]();
}

router.get('/', (req, res) => {
    try {
        res.json({
            code: 200,
            data: {
                poetry: Array.from({ length: 5 }, () => generatePoeticSentence()),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: "文字游戏生成失败",
            tip: "请尝试刷新页面"
        });
    }
});


// 修改大姐姐风格词汇库
const sisterMetaphors = {
    subjects: ['好孩子', '优等生', '实习男友', '按摩学徒', '乖徒弟'],
    verbs: ['指压教学', '呼吸指导', '耳畔低语', '解开纽扣', '矫正姿势'],
    adverbs: ['手把手地', '贴着后背', '在黑暗中', '借着酒意'],
    bodyParts: ['锁骨', '后颈', '手腕', '腰窝'],
    suffixes: ['呀♡', '好吗？', '喔...', '呐♫']
};

// 修改生成逻辑
function generateSisterSentence() {
    const templates = [
        () => `${sisterMetaphors.adverbs[Math.floor(Math.random() * 4)]} ${sisterMetaphors.verbs[Math.floor(Math.random() * 5)]}的${sisterMetaphors.subjects[Math.floor(Math.random() * 5)]}${sisterMetaphors.suffixes[Math.floor(Math.random() * 4)]}`,
        () => `这么敏感的${sisterMetaphors.bodyParts[Math.floor(Math.random() * 4)]}...${sisterMetaphors.subjects[Math.floor(Math.random() * 5)]}需要特别指导吗${sisterMetaphors.suffixes[Math.floor(Math.random() * 4)]}`,
        () => `让姐姐教你${sisterMetaphors.verbs[Math.floor(Math.random() * 5)]}的${sisterMetaphors.subjects[Math.floor(Math.random() * 5)]}${sisterMetaphors.suffixes[Math.floor(Math.random() * 4)]}`
    ];

    return templates[Math.floor(Math.random() * 3)]();
}

// 错误提示修改
router.get('/sister', (req, res) => {
    try {
        res.json({
            code: 200,
            data: {
                poetry: Array.from({ length: 5 }, () => generateSisterSentence()),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: "教学进度受阻",
            tip: "需要姐姐的亲自指导吗？"
        });
    }
});

module.exports = router;
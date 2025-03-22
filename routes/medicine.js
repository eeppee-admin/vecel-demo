import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

// 西药基础数据
const westernNames = ['阿莫西林', '布洛芬', '头孢克肟', '二甲双胍', '氨氯地平'];
const ypjxList = ['片剂', '胶囊', '注射液', '颗粒剂', '软膏'];
const ypggList = ['10mg×20片', '50mg×10袋', '5ml×5支', '0.3g×30粒'];

// 中草药基础数据
const chineseNames = ['金银花', '人参', '黄芪', '当归', '丹参'];
const gxflList = ['清热解毒', '活血化瘀', '补气养血', '祛风除湿'];
const gxylList = ['煎服3-9g', '研末吞服1-3g', '外用适量', '泡酒饮用'];

const icdCodes = [
    { id: 'A00.0', name: '霍乱' },
    { id: 'B20', name: '人类免疫缺陷病毒病[HIV]' },
    { id: 'C34.90', name: '支气管肺癌' },
    { id: 'E11.9', name: '2型糖尿病' },
    { id: 'I10', name: '原发性高血压' },
    { id: 'J45.909', name: '支气管哮喘' },
    { id: 'M17.9', name: '膝骨关节炎' },
    { id: 'N39.0', name: '尿路感染' }
];


function generateWesternData() {
    return Array.from({ length: 100 }, (_, i) => ({
        WesternMediclineID: `WM${(i + 1).toString().padStart(4, '0')}`,
        WesternMediclineName: westernNames[Math.floor(Math.random() * westernNames.length)],
        Ypjx: ypjxList[Math.floor(Math.random() * ypjxList.length)],
        Ypgg: ypggList[Math.floor(Math.random() * ypggList.length)]
    }));
}

function generateChineseData() {
    return Array.from({ length: 100 }, (_, i) => ({
        ChineseMediclineID: `CM${(i + 1).toString().padStart(4, '0')}`,
        ChineseMediclineName: chineseNames[Math.floor(Math.random() * chineseNames.length)],
        Gxfl: gxflList[Math.floor(Math.random() * gxflList.length)],
        Gxyl: gxylList[Math.floor(Math.random() * gxylList.length)]
    }));
}


// 生成ICD-10数据
function generateICDData() {
    return Array.from({ length: 100 }, (_, i) => ({
        DiagnosisID: `ICD10_${(i + 1).toString().padStart(3, '0')}`,
        DiagnosisName: icdCodes[Math.floor(Math.random() * icdCodes.length)].name
    }));
}

router.get('/western', (req, res) => {
    res.json({
        code: 200,
        data: generateWesternData(),
        timestamp: new Date().toISOString()
    });
});

router.get('/chinese', (req, res) => {
    res.json({
        code: 200,
        data: generateChineseData(),
        timestamp: new Date().toISOString()
    });
});

// 新增路由
router.get('/icd10', (req, res) => {
    res.json({
        code: 200,
        data: generateICDData(),
        timestamp: new Date().toISOString()
    });
});



// 新增病种模板基础数据
const diseaseTemplates = [
    {
        name: "原发性高血压",
        icd10: "I10",
        symptoms: "头痛、眩晕、心悸气短",
        diagnosis: "血压持续≥140/90mmHg",
        treatment: "降压药物治疗+生活方式干预"
    },
    {
        name: "2型糖尿病",
        icd10: "E11.9",
        symptoms: "多饮、多食、多尿、体重下降",
        diagnosis: "空腹血糖≥7.0mmol/L或OGTT2小时≥11.1mmol/L",
        treatment: "口服降糖药或胰岛素治疗"
    },
    // 添加更多模板...
];

// 生成病种模板数据
function generateSickTemplates() {
    return Array.from({ length: 100 }, (_, i) => {
        const template = diseaseTemplates[i % diseaseTemplates.length];
        return {
            SickTemplateCode: `ST-${(i + 1).toString().padStart(3, '0')}`,
            DiseaseName: `${template.name}管理方案`,
            ICD10Code: template.icd10,
            CommonSymptoms: template.symptoms,
            DiagnosisDescription: template.diagnosis,
            TreatmentPlan: template.treatment,
            Notes: `本方案最后更新于2024年${(i % 12 + 1)}月`
        };
    });
}

// 新增路由
router.get('/sick-templates', (req, res) => {
    res.json({
        code: 200,
        data: generateSickTemplates(),
        timestamp: new Date().toISOString()
    });
});

export default router;
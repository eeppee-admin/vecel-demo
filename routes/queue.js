import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

// 基础数据池
const doctors = ['张伟', '李娜', '王强', '赵敏'];
const diagnosisResults = ['高血压', '糖尿病', '上呼吸道感染', '腰肌劳损'];
const cities = ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区'];

// 生成符合中国标准的18位身份证号
function generateIDNumber() {
    const areaCode = '110105'; // 北京朝阳区
    const birthDate = new Date(Date.now() - Math.random() * 70 * 365 * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 10).replace(/-/g, '');
    const randomCode = Math.random().toString().slice(2, 17).padEnd(15, '0');
    return areaCode + birthDate + randomCode.slice(0, 12) + 'X';
}

function generateQueueData() {
    const queues = [];
    const usedIDs = new Set();

    for (let i = 1; i <= 100; i++) {
        let idNumber;
        do {
            idNumber = generateIDNumber();
        } while (usedIDs.has(idNumber));
        usedIDs.add(idNumber);

        const firstVisitTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

        queues.push({
            PatientQueueCode: `QC-${(i + 1000).toString().substring(1)}`,
            PatientID: 1000 + i,
            DoctorID: Math.floor(Math.random() * 4) + 1,
            Name: `患者${String.fromCharCode(65 + i % 26)}`,
            MedicalRecordNumber: `MRN-${new Date().getFullYear()}${(i + 1000).toString().substring(1)}`,
            Gender: Math.random() > 0.5 ? '男' : '女',
            Age: Math.floor(Math.random() * 80 + 18),
            Occupation: ['教师', '工程师', '医生', '自由职业'][Math.floor(Math.random() * 4)],
            ContactAddress: `${cities[Math.floor(Math.random() * 4)]}某路${Math.floor(Math.random() * 1000)}号`,
            ContactPhone: `13${Math.random().toString().slice(2, 11).padEnd(9, '0')}`,
            IDNumber: idNumber,
            FirstVisitTime: firstVisitTime,
            ConsultationTime: Math.random() > 0.3 ? new Date(firstVisitTime.getTime() + 30 * 60 * 1000) : null,
            DiagnosisResult: diagnosisResults[Math.floor(Math.random() * 4)],
            InitialOrFollowUp: Math.random() > 0.7 ? '复诊' : '初诊',
            RegistrationDoctor: doctors[Math.floor(Math.random() * 4)],
            IsImmediateConsultation: Math.random() > 0.5,
            IsConsultationStopped: Math.random() > 0.8
        });
    }
    return queues;
}

router.get('/', (req, res) => {
    res.json({
        code: 200,
        data: generateQueueData(),
        timestamp: new Date().toISOString()
    });
});

export default router;
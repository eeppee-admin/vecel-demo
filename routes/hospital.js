import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

// 生成随机就诊记录数据
router.get('/visits/generate', (req, res) => {
    try {
        const { count = 100, patientIdRange = [1, 50], doctorIdRange = [1, 20] } = req.body;

        // 诊断名称列表
        const diagnosisNames = [
            '上呼吸道感染', '高血压', '糖尿病', '胃炎', '肺炎',
            '骨折', '贫血', '结膜炎', '过敏性鼻炎', '腰椎间盘突出',
            '冠心病', '肝炎', '肾结石', '偏头痛', '抑郁症'
        ];

        // 就诊状态
        const statusOptions = ['已挂号', '就诊中', '已完成', '已取消'];

        // 生成随机日期（过去一年内）
        const getRandomDate = () => {
            const now = new Date();
            const pastYear = new Date(now);
            pastYear.setFullYear(now.getFullYear() - 1);

            return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
        };

        // 生成随机就诊记录
        const visits = Array.from({ length: count }, (_, index) => {
            const patientId = Math.floor(Math.random() * (patientIdRange[1] - patientIdRange[0] + 1)) + patientIdRange[0];
            const doctorId = Math.floor(Math.random() * (doctorIdRange[1] - doctorIdRange[0] + 1)) + doctorIdRange[0];
            const diagnosisName = diagnosisNames[Math.floor(Math.random() * diagnosisNames.length)];

            return {
                jz_id: index + 1,
                patient_id: patientId,
                doctor_id: doctorId,
                visit_time: getRandomDate().toISOString(),
                diagnosis: `患者表现出${diagnosisName}的典型症状，建议进行相关治疗。`,
                diagnosis_name: diagnosisName,
                status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
                is_deleted: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        });

        res.json({
            code: 200,
            message: `成功生成${count}条就诊记录`,
            data: visits
        });
    } catch (error) {
        console.error('生成就诊记录失败:', error);
        res.status(500).json({
            code: 500,
            message: '生成就诊记录失败',
            error: error.message
        });
    }
});

export default router;
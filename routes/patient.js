const express = require('express');
const router = express.Router();

// 基础数据池
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄'];
const givenNames = ['伟', '芳', '娜', '强', '敏', '军', '杰', '婷婷'];
const cities = ['北京市', '上海市', '广州市', '深圳市', '成都市'];
const occupations = ['工程师', '医生', '教师', '公务员', '自由职业'];
const ethnicGroups = ['汉族', '蒙古族', '回族', '藏族', '维吾尔族'];

function generatePatientData() {
  const patients = [];
  const usedIDs = new Set();

  for(let i = 1; i <= 100; i++) {
    // 生成唯一身份证号
    let idNumber;
    do {
      const birthDate = new Date(Date.now() - Math.random() * 90*365*24*60*60*1000)
        .toISOString().slice(0,10).replace(/-/g, '');
      const suffix = Math.random().toString().slice(2, 18).padEnd(17, '0').slice(0, 17);
      idNumber = `11010${birthDate}${suffix}`;
    } while(usedIDs.has(idNumber));
    usedIDs.add(idNumber);

    patients.push({
      PatientCode: `PT-${i.toString().padStart(4, '0')}`,
      Name: `${surnames[Math.floor(Math.random()*surnames.length)]}${
        givenNames[Math.floor(Math.random()*givenNames.length)]}`,
      Gender: Math.random() > 0.5 ? '男' : '女',
      DateOfBirth: new Date(Date.now() - Math.random() * 90*365*24*60*60*1000),
      IdentificationNumber: idNumber,
      ContactPhone: `13${Math.random().toString().slice(2,11).padEnd(9,'0')}`,
      ContactAddress: `${cities[Math.floor(Math.random()*cities.length)]}某区某路${Math.floor(Math.random()*1000)}号`,
      Nationality: '中国',
      Ethnicity: ethnicGroups[Math.floor(Math.random()*ethnicGroups.length)],
      OccupationCategory: occupations[Math.floor(Math.random()*occupations.length)],
      MaritalStatus: ['未婚', '已婚', '离异'][Math.floor(Math.random()*3)],
      EducationLevel: ['小学', '初中', '高中', '大学'][Math.floor(Math.random()*4)]
    });
  }
  return patients;
}

router.get('/', (req, res) => {
  res.json({
    code: 200,
    data: generatePatientData(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
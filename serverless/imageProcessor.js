const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
  // 动态扩容图片处理
  const params = {
    FunctionName: 'image-processing',
    InvocationType: 'Event',
    Payload: JSON.stringify(event)
  };
  
  return lambda.invoke(params).promise();
};
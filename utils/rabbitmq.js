const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

// RabbitMQ 连接配置
const MQ_CONFIG = {
  URL: process.env.MQ_URL || 'amqp://localhost',
  EXCHANGES: {
    VIDEO: 'video_processing',
    DLX: 'video_dlx' // 死信交换
  },
  QUEUES: {
    TASKS: 'video_tasks',
    AUDIT: 'video_audit',
    DLQ: 'video_dead_letter'
  }
};

class VideoMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async init() {
    this.connection = await amqp.connect(MQ_CONFIG.URL);
    this.channel = await this.connection.createChannel();

    // 声明死信交换
    await this.channel.assertExchange(MQ_CONFIG.EXCHANGES.DLX, 'direct', { durable: true });

    // 声明主交换
    await this.channel.assertExchange(MQ_CONFIG.EXCHANGES.VIDEO, 'direct', { durable: true });

    // 创建任务队列（带死信配置）
    await this.channel.assertQueue(MQ_CONFIG.QUEUES.TASKS, {
      durable: true,
      deadLetterExchange: MQ_CONFIG.EXCHANGES.DLX,
      deadLetterRoutingKey: MQ_CONFIG.QUEUES.DLQ
    });

    // 绑定队列
    await this.channel.bindQueue(MQ_CONFIG.QUEUES.TASKS, MQ_CONFIG.EXCHANGES.VIDEO, 'task');

    // 初始化消费者
    this.setupConsumers();
  }

  // 生产视频任务消息
  async publishTask(task) {
    const message = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      payload: task
    };

    return this.channel.publish(
      MQ_CONFIG.EXCHANGES.VIDEO,
      'task',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  // 消费者配置
  setupConsumers() {
    // 视频处理消费者
    this.channel.consume(MQ_CONFIG.QUEUES.TASKS, async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        await this.processVideo(content.payload);
        this.channel.ack(msg);
      } catch (err) {
        console.error('任务处理失败:', err);
        this.channel.nack(msg, false, false); // 不重新入队
      }
    }, { noAck: false });
  }

  // 视频处理逻辑（示例）
  async processVideo(task) {
    // 实现转码、水印添加等复杂逻辑
    console.log(`Processing video ${task.videoId}`);
    // 模拟耗时操作
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// module.exports = new VideoMQ();

export default VideoMQ;
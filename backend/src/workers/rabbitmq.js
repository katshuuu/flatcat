const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const TASK_QUEUE = 'tasks_queue';
const DLQ = 'tasks_dlq';
const EXCHANGE = 'tasks_exchange';
const DLX = 'tasks_dlx';
const MAX_RETRIES = 3;

let connection = null;
let channel = null;

async function connect() {
  if (channel) return channel;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
  await channel.assertExchange(DLX, 'direct', { durable: true });

  await channel.assertQueue(DLQ, { durable: true });
  await channel.bindQueue(DLQ, DLX, 'failed');

  await channel.assertQueue(TASK_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DLX,
      'x-dead-letter-routing-key': 'failed',
    },
  });
  await channel.bindQueue(TASK_QUEUE, EXCHANGE, 'task');

  connection.on('close', () => {
    channel = null;
    connection = null;
  });

  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err.message);
    channel = null;
    connection = null;
  });

  return channel;
}

async function publishTask(task) {
  const ch = await connect();
  const message = Buffer.from(JSON.stringify(task));
  ch.publish(EXCHANGE, 'task', message, { persistent: true });
}

async function consumeTask(handler) {
  const ch = await connect();
  ch.prefetch(1);

  await ch.consume(TASK_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const task = JSON.parse(msg.content.toString());
      console.log(`Processing task: ${task.type} (id: ${task.taskId})`);

      await handler(task);

      ch.ack(msg);
      console.log(`Task completed: ${task.taskId}`);
    } catch (err) {
      console.error(`Task failed: ${err.message}`);

      const headers = msg.properties.headers || {};
      const retryCount = (headers['x-retry-count'] || 0) + 1;

      if (retryCount <= MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying task in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`);

        setTimeout(() => {
          ch.publish(EXCHANGE, 'task', msg.content, {
            persistent: true,
            headers: { 'x-retry-count': retryCount },
          });
        }, delay);

        ch.ack(msg);
      } else {
        console.error(`Task moved to DLQ after ${MAX_RETRIES} retries`);
        ch.publish(DLX, 'failed', msg.content, { persistent: true });
        ch.ack(msg);
      }
    }
  });
}

async function closeConnection() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
}

module.exports = {
  connect,
  publishTask,
  consumeTask,
  closeConnection,
  TASK_QUEUE,
  DLQ,
  EXCHANGE,
  DLX,
  MAX_RETRIES,
};

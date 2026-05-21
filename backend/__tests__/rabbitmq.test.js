const amqp = require('amqplib');
const {
  connect,
  publishTask,
  closeConnection,
  TASK_QUEUE,
  DLQ,
  MAX_RETRIES,
} = require('../src/workers/rabbitmq');

jest.mock('amqplib');

describe('RabbitMQ module', () => {
  let mockChannel;
  let mockConnection;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChannel = {
      assertExchange: jest.fn().mockResolvedValue(),
      assertQueue: jest.fn().mockResolvedValue(),
      bindQueue: jest.fn().mockResolvedValue(),
      publish: jest.fn(),
      prefetch: jest.fn(),
      consume: jest.fn().mockResolvedValue(),
      ack: jest.fn(),
      close: jest.fn().mockResolvedValue(),
      on: jest.fn(),
    };
    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn().mockResolvedValue(),
      on: jest.fn(),
    };
    amqp.connect.mockResolvedValue(mockConnection);
  });

  afterEach(async () => {
    await closeConnection();
  });

  it('exports queue constants', () => {
    expect(TASK_QUEUE).toBe('tasks_queue');
    expect(DLQ).toBe('tasks_dlq');
    expect(MAX_RETRIES).toBe(3);
  });

  it('connects and sets up exchanges and queues', async () => {
    const ch = await connect();
    expect(amqp.connect).toHaveBeenCalled();
    expect(mockChannel.assertExchange).toHaveBeenCalledTimes(2);
    expect(mockChannel.assertQueue).toHaveBeenCalledTimes(2);
    expect(ch).toBe(mockChannel);
  });

  it('reuses existing channel on second connect', async () => {
    await connect();
    await connect();
    expect(amqp.connect).toHaveBeenCalledTimes(1);
  });

  it('publishTask sends message to exchange', async () => {
    await publishTask({ taskId: '1', type: 'email', payload: {} });
    expect(mockChannel.publish).toHaveBeenCalledWith(
      'tasks_exchange',
      'task',
      expect.any(Buffer),
      { persistent: true }
    );
  });

  it('closeConnection closes channel and connection', async () => {
    await connect();
    await closeConnection();
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });
});


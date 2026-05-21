jest.mock('../src/config/supabase', () => ({
  from: jest.fn(() => ({
    update: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

const { processTask } = require('../src/workers/consumer');

describe('Consumer processTask', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setTimeout').mockImplementation((cb) => {
      cb();
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('processes email task type', async () => {
    await processTask({
      taskId: 't1',
      type: 'email',
      payload: { to: 'test@test.com', subject: 'Hello' },
    });
  });

  it('processes notification task type', async () => {
    await processTask({
      taskId: 't2',
      type: 'notification',
      payload: { message: 'Hi' },
    });
  });

  it('processes order_confirmation task type', async () => {
    await processTask({
      taskId: 't3',
      type: 'order_confirmation',
      payload: { orderId: 'o1' },
    });
  });

  it('processes unknown task type', async () => {
    await processTask({ taskId: 't4', type: 'custom', payload: {} });
  });
});

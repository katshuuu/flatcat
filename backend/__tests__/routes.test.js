const request = require('supertest');
const { generateToken } = require('../src/middleware/auth');

jest.mock('../src/config/supabase', () => {
  const mockFrom = jest.fn();
  const mockAuth = {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
  };
  return { from: mockFrom, auth: mockAuth, __mockFrom: mockFrom, __mockAuth: mockAuth };
});

jest.mock('../src/workers/producer', () => ({
  publishTask: jest.fn().mockResolvedValue(),
}));

const supabase = require('../src/config/supabase');
const { publishTask } = require('../src/workers/producer');
const app = require('../src/index');

function chain(result) {
  const c = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
    single: jest.fn().mockResolvedValue(result),
  };
  c.order.mockResolvedValue(result);
  c.limit.mockResolvedValue(result);
  return c;
}

describe('REST API routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  describe('Products', () => {
    it('GET /api/products returns list', async () => {
      const products = [{ id: '1', name: 'Tag', is_active: true }];
      supabase.__mockFrom.mockReturnValue(chain({ data: products, error: null }));

      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(products);
    });

    it('GET /api/products/:id returns 404 when missing', async () => {
      supabase.__mockFrom.mockReturnValue(chain({ data: null, error: null }));

      const res = await request(app).get('/api/products/missing');
      expect(res.status).toBe(404);
    });
  });

  describe('Auth protected routes', () => {
    const token = generateToken({ id: 'u1', email: 'a@b.com', role: 'customer' });

    it('POST /api/tasks requires auth', async () => {
      const res = await request(app).post('/api/tasks').send({ type: 'email' });
      expect(res.status).toBe(401);
    });

    it('POST /api/tasks creates task', async () => {
      const task = { id: 't1', type: 'email', payload: {}, status: 'pending' };
      supabase.__mockFrom.mockReturnValue(chain({ data: task, error: null }));

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'email', payload: { to: 'a@b.com' } });

      expect(res.status).toBe(201);
      expect(publishTask).toHaveBeenCalled();
    });

    it('POST /tasks is alias for POST /api/tasks', async () => {
      const task = { id: 't2', type: 'notification', payload: {}, status: 'pending' };
      supabase.__mockFrom.mockReturnValue(chain({ data: task, error: null }));

      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'notification', payload: { message: 'Hi' } });

      expect(res.status).toBe(201);
      expect(publishTask).toHaveBeenCalled();
    });

    it('POST /api/tasks validates type', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('GET /api/orders/my returns user orders', async () => {
      const orders = [{ id: 'o1', user_id: 'u1' }];
      supabase.__mockFrom.mockReturnValue(chain({ data: orders, error: null }));

      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(orders);
    });

    it('POST /api/orders validates required fields', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('POST /api/orders accepts cat_name and design_preferences', async () => {
      const order = {
        id: 'o2',
        pet_name: 'Мурзик',
        design_preferences: { template: 'fruit', coat: 'ginger_tabby' },
        status: 'pending',
      };
      supabase.__mockFrom.mockReturnValue(chain({ data: order, error: null }));

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cat_name: 'Мурзик',
          phone_number: '+7999',
          product_line: 'fruit',
          design_preferences: { template: 'fruit', texture: 'velour' },
          total_price: 6500,
        });

      expect(res.status).toBe(201);
      expect(res.body.cat_name).toBe('Мурзик');
    });

    it('admin can list all orders', async () => {
      const adminToken = generateToken({ id: 'a1', email: 'admin@b.com', role: 'admin' });
      supabase.__mockFrom.mockReturnValue(chain({ data: [], error: null }));

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('customer cannot list all orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});

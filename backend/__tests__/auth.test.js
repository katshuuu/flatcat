const jwt = require('jsonwebtoken');
const {
  generateToken,
  verifyToken,
  authMiddleware,
  roleMiddleware,
} = require('../src/middleware/auth');

describe('Auth middleware', () => {
  it('generates and verifies JWT token', () => {
    const token = generateToken({ id: '1', email: 'a@b.com', role: 'customer' });
    const decoded = verifyToken(token);
    expect(decoded.email).toBe('a@b.com');
    expect(decoded.role).toBe('customer');
  });

  it('rejects request without token', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts valid bearer token', () => {
    const token = generateToken({ id: '1', email: 'a@b.com', role: 'admin' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe('admin');
  });

  it('rejects invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('roleMiddleware allows matching role', () => {
    const req = { user: { role: 'manager' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    roleMiddleware('admin', 'manager')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('roleMiddleware denies wrong role', () => {
    const req = { user: { role: 'customer' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    roleMiddleware('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('roleMiddleware requires authentication', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    roleMiddleware('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

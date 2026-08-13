process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

describe('Health check', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth validation (no DB required)', () => {
  it('rejects signup with a short name', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Short Name',
      email: 'test@example.com',
      address: '123 Test Street',
      password: 'Password@123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('rejects signup with a weak password', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'A Valid Twenty Char Name!!',
      email: 'test@example.com',
      address: '123 Test Street',
      password: 'weakpassword',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('rejects login with an invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'whatever',
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejects unauthenticated access to admin dashboard', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.statusCode).toBe(401);
  });
});

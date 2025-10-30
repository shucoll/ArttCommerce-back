import request from 'supertest';

import app from '../../app';

describe('GET /healthz', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

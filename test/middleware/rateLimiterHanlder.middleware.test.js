import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import { models } from '../../src/libs/sequelize.js';
import { createUser } from '../../src/services/user.service.js';
import { deleteData } from '../utils.js';

describe('Integration Test: Rate Limiting', () => {
  beforeEach(async () => {
    await deleteData(models);
    await createUser({
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    });
  });

  it('Max valide requests (Retornar 429)', async () => {
    const uniqueIp = `192.168.1.${Math.floor(Math.random() * 254)}`;
    const MAX_ATTEMPTS = 5;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('X-Forwarded-For', uniqueIp)
        .send({ email: 'test@gmail.com', password: 'testpassword1' });
      expect(res.status).to.not.equal(429);
    }

    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('X-Forwarded-For', uniqueIp)
      .send({ email: 'test@gmail.com', password: 'testpassword1' });

    expect(response.status).to.equal(429);
    expect(response.body.status).to.equal(429);
  });
});

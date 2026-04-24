import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import { deleteData } from '../utils.js';
import { models } from '../../src/libs/sequelize.js';
import { createUser } from '../../src/services/user.service.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('POST Register', () => {
  beforeEach(async () => {
    await deleteData(models);
  });

  it('Should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      .expect(201);

    expect(res.body.message).to.be.equal(SERVICE_MESSAGES.REGISTER_USER);
  });

  it('Should register a user failed', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({})
      .expect(400);

    expect(res.status).to.equal(400);
    expect(res.body.message).to.exist;
  });
});

describe('POST Login', () => {
  beforeEach(async () => {
    await deleteData(models);
    await createUser({
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    });
  });

  it('Should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@gmail.com',
        password: 'testpassword1',
      })
      .expect(200);

    expect(res.body.message).to.be.equal(SERVICE_MESSAGES.LOGIN_USER);
  });

  it('Should register a user failed', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({})
      .expect(400);

    expect(res.status).to.equal(400);
    expect(res.body.message).to.exist;
  });
});

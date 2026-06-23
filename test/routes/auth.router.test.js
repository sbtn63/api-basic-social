import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import { BrevoClient } from '@getbrevo/brevo';

import { deleteData } from '../utils.js';
import { models } from '../../src/libs/sequelize.js';
import { createUser } from '../../src/services/user.service.js';
import { addEmailVerification } from '../../src/services/emailVerification.service.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('Auth E2E Tests', () => {
  let sendEmailStub;

  beforeEach(async () => {
    await deleteData(models);

    sendEmailStub = sinon
      .stub(BrevoClient.prototype.transactionalEmails, 'sendTransacEmail')
      .resolves({ messageId: 'test-id' });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST Register', () => {
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

      expect(res.body.message).to.equal(SERVICE_MESSAGES.REGISTER_USER);
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

    it('Should login successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@gmail.com',
          password: 'testpassword1',
        })
        .expect(200);

      expect(res.body.message).to.equal(SERVICE_MESSAGES.LOGIN_USER);
    });

    it('Should fail login with empty body', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.exist;
    });
  });

  describe('POST Verify Email Request', () => {
    let user;
    let token;

    beforeEach(async () => {
      await deleteData(models);

      user = await createUser({
        firstName: "Test",
        lastName: "User",
        email: "test@gmail.com",
        password: "testpassword1"
      });

      const login = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@gmail.com',
          password: 'testpassword1',
        });

      token = login.body.data.token;
    });

    it('Should send verification email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-email/request')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.message).to.exist;
      expect(res.body.data.expiresAt).to.exist;
      expect(sendEmailStub.calledOnce).to.be.true;
    });

    it('Should send verify email', async () => {
      const verification = await addEmailVerification(user.email);
      const res = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: verification.code
        })
        .expect(200);

      expect(res.body.message).to.exist;
    });

     it('Should fail verify body', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: 1111111
        })
        .expect(400);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.exist;
    });
  });
});

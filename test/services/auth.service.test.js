import { expect } from 'chai';
import sinon from 'sinon';
import { BrevoClient } from '@getbrevo/brevo';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { loginUser, registerUser, requestVerifiedEmail, verifyEmail } from '../../src/services/auth.service.js';
import { createUser } from '../../src/services/user.service.js';
import ResponseError from '../../src/schemas/responseError.schema.js';
import ResponseSuccess from '../../src/schemas/responseSuccess.schema.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';
import { addEmailVerification, getActiveEmailVerification } from '../../src/services/emailVerification.service.js';

describe('Auth Service Test', () => {
  let body;
  let user;
  beforeEach(async() => {
    await deleteData(models);
    body = {
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    };
    user = await createUser(body);
  });

  it('Should register a user success', async () => {
    body.email = "testRegister@gmail.com";
    const response = await registerUser(body);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.REGISTER_USER);
    expect(response.data.token).to.be.a('string');
    expect(response.data.token.length).to.be.at.least(20);
    expect(response.status).to.be.equal(201);
  });

  it('Should throw error when email exist', async () => {
    try {
      await registerUser(body);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.VALIDATION_ERROR);
      expect(error.details.email).to.be.equal(SERVICE_MESSAGES.EMAIL_VALIDATION_MESSAGE);
    }
  });

  it('Should login a user success', async () => {
    const response = await loginUser({
      email: 'test@gmail.com',
      password: 'testpassword1'
    });

    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.LOGIN_USER);
    expect(response.data.token).to.be.a('string');
    expect(response.data.token.length).to.be.at.least(20);
    expect(response.status).to.be.equal(200);
  });

  it('Should throw error when email not exist', async () => {
    try {
      await loginUser({
        email: 'notfound@gmail.com',
        password: 'testpassword1'
      });
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.CREDENTIALS_INVALID);
    }
  });

  it('Should throw error when password not match', async () => {
    try {
      await loginUser({
        email: 'test@gmail.com',
        password: 'nomatchpassword'
      });
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.CREDENTIALS_INVALID);
    }
  });

  it('Should request verified email success', async () => {
    const sendStub = sinon
      .stub(BrevoClient.prototype.transactionalEmails, 'sendTransacEmail')
      .resolves({ messageId: 'test' });

    const response = await requestVerifiedEmail(user.id);

    expect(response.status).to.be.equal(200);
    expect(sendStub.calledOnce).to.be.true;

    sinon.restore();
  });

  it('Should throw when user is already verified', async () => {
    await models.User.update(
      { isVerified: true },
      { where: { id: user.id } }
    );
    try {
      await requestVerifiedEmail(user.id);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_EMAIL_VERIFIED);
    }
  });

  it('Should invalidate existing verification and create a new one', async () => {
    const oldVerification = await addEmailVerification(user.email);

    const sendStub = sinon
      .stub(BrevoClient.prototype.transactionalEmails, 'sendTransacEmail')
      .resolves({ messageId: 'test' });

    const response = await requestVerifiedEmail(user.id);

    expect(response.status).to.be.equal(200);
    expect(sendStub.calledOnce).to.be.true;

    const newVerification = await getActiveEmailVerification(user.email);

    expect(newVerification.code).to.not.equal(oldVerification.code);

    sinon.restore();
  });

  it('Should verify email success', async () => {
    const oldVerification = await addEmailVerification(user.email);
    const response = await verifyEmail(oldVerification.code, user.id);

    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.EMAIL_VERIFY_SUCCESS);
    expect(response.status).to.be.equal(200);
  });

  it('Should throw Invalid Code Verification', async () => {
    try {
      await verifyEmail('786153', user.id);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.INVALID_CODE_EMAIL_VERIFICATION);
    }
  });
});

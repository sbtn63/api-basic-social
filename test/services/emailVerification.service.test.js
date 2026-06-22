import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { addEmailVerification, getEmailVerification, changeIsUsed, invalidateEmailVerification, getActiveEmailVerification } from '../../src/services/emailVerification.service.js';
import config from '../../src/config/index.cjs';

describe('EmailVerification Service Test', () => {
  let user;
  beforeEach(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
  });

  it('Should register a emailVerification success', async () => {
    const emailVerification = await addEmailVerification(user.email);
    expect(emailVerification).to.be.an('object');
    expect(emailVerification.email).to.be.equal(user.email);
  });

  it('Get Active EmailVerification', async () => {
    const verificationEmail = await addEmailVerification(user.email);
    const instanceEmailVerification = await getActiveEmailVerification(user.email, verificationEmail.code);
    expect(instanceEmailVerification.isUsed).to.be.equal(false);
  });

  it('Change IsUsed EmailVerification', async () => {
    const emailVerification = await addEmailVerification(user.email);
    const instanceEmailVerification = await changeIsUsed(emailVerification);
    expect(instanceEmailVerification.isUsed).to.be.equal(true);
  });

  it('Invalid Email Verification', async () => {
    const emailVerification = await addEmailVerification(user.email);
    const instanceEmailVerification = await invalidateEmailVerification(emailVerification);
    const dateInterval = Date.now() - 24 * 60 * 60 * 1000;
    expect(instanceEmailVerification.expiresAt.getTime()).to.be.at.most(dateInterval);
  });

  it('Get Email Verification Valid', async () => {
    const emailVerification = await addEmailVerification(user.email);
    const emailVerificationValid = await getEmailVerification(emailVerification.email, emailVerification.code);
    expect(emailVerificationValid).to.be.an('object');
    expect(emailVerificationValid.isUsed).to.be.equal(false);
  });
});

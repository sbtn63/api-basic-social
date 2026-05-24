import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';

describe('EmailVerification Model', () => {
  let emailVerification;

  beforeEach(async() => {
    await deleteData(models);
    emailVerification = await models.EmailVerification.create({
      email: 'test@gmail.com',
      code: '123456',
      expiresAt: new Date()
    });
  });

  it('should get email verifications', async () => {
    const emailVerifications = await models.EmailVerification.findAll();
    expect(emailVerifications).to.be.an('array');
    expect(emailVerifications[0].email).to.equal('test@gmail.com');
    expect(emailVerifications[0].code).to.equal('123456');
    expect(emailVerifications[0].isUsed).to.equal(false);
  });

  it('should insert a new email verification', async () => {
    const emailVerificationNew = await models.EmailVerification.create({
      email: 'test2@gmail.com',
      code: '123457',
      expiresAt: new Date()
    });

    expect(emailVerificationNew).to.be.an('object');
    expect(emailVerificationNew.isUsed).to.equal(false);
    expect(emailVerificationNew.expiresAt).to.not.be.null;
  });

  it('should get email verification', async () => {
    const emailVerificationById = await models.EmailVerification.findByPk(emailVerification.id);
    expect(emailVerificationById).to.not.be.null;
  });

  it('should update email verification', async () => {
    emailVerification.isUsed = true;
    await emailVerification.save();
    expect(emailVerification.isUsed).to.equal(true);
  });

  it('should delete email verification', async () => {
    await emailVerification.destroy();
    const emailVerificationDelete = await models.EmailVerification.findByPk(emailVerification.id);
    expect(emailVerificationDelete).to.be.null;
  });

});

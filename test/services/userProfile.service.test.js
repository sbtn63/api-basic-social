import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { getUserByFullName, updateUserAvatar, updateUserProfile, changeEmailUser, changePasswordUser } from '../../src/services/userProfile.service.js';
import { createUser } from '../../src/services/user.service.js';
import ResponseError from '../../src/schemas/responseError.schema.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('User Profile Test', () => {
  let user;
  beforeEach(async() => {
    await deleteData(models);
    user = await createUser({ firstName: 'A', lastName: 'B', email: 'a@test.com', password: '123'});
     await models.User.create({ firstName: 'B', lastName: 'C', email: 'b@test.com', passwordHash: '123'});
  });

  it('Should get users for fullname', async () => {
    const response = await getUserByFullName('a b', {limit: 1, offset: 0});
    expect(response.data).to.be.an('array');
  });

  it('Should get users not found', async () => {
    try {
      await getUserByFullName("s", {limit: 1, offset: 0});
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND);
    }
  });

  it('Should update user profile', async () => {
    const response = await updateUserProfile({firstName: 'C', lastName: 'D'}, user.id);
    expect(response.data).to.be.an('object');
    expect(response.data.firstName).to.be.equal('C');
    expect(response.data.lastName).to.be.equal('D');
    expect(response.message).to.be.equal(SERVICE_MESSAGES.USER_PROFILE_UPDATE_SUCCESS);
  });

  it('Should user update profile not found', async () => {
    try {
      await updateUserProfile({firstName: 'A', lastName: 'D'}, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_NOT_FOUND);
    }
  });

  it('Should update user avatar', async () => {
    const response = await updateUserAvatar({avatarUrl: 'https://test.image.url'}, user.id);
    expect(response.data).to.be.an('object');
    expect(response.data.avatarUrl).to.be.equal('https://test.image.url');
    expect(response.message).to.be.equal(SERVICE_MESSAGES.USER_AVATAR_UPDATE_SUCCESS);
  });

  it('Should user update avatar not found', async () => {
    try {
      await updateUserAvatar({avatarUrl: 'https://test.image.url'}, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_NOT_FOUND);
    }
  });

  it('Should update user email', async () => {
    const response = await changeEmailUser({newEmail: 'testEmail@test.com'}, user.id);
    expect(response.data).to.be.an('object');
    expect(response.data.email).to.be.equal('testEmail@test.com');
    expect(response.message).to.be.equal(SERVICE_MESSAGES.EMAIL_UPDATE_SUCCESS);
  });

  it('Should update user equal email', async () => {
    const response = await changeEmailUser({newEmail: user.email}, user.id);
    expect(response.data).to.be.an('object');
    expect(response.data.email).to.be.equal(user.email);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.EMAIL_UPDATE_SUCCESS);
  });

  it('Should user update email not found', async () => {
    try {
      await changeEmailUser({avatarUrl: 'testEmail@test.com'}, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_NOT_FOUND);
    }
  });

  it('Should user update email exists', async () => {
    try {
      await changeEmailUser({newEmail: 'b@test.com'}, user.id);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(209);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.EMAIL_EXISTS);
    }
  });

  it('Should update user password', async () => {
    const response = await changePasswordUser({currentPassword: '123', newPassword: '1234'}, user.id);
    expect(response.data).to.be.an('object');
    expect(response.message).to.be.equal(SERVICE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
  });

  it('Should user update password incorrect', async () => {
    try {
      await changePasswordUser({currentPassword: '1234', newPassword: '123'}, user.id);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(400);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.CREDENTIALS_INVALID);
    }
  });

  it('Should user update password not found', async () => {
    try {
      await changePasswordUser({currentPassword: '123', newPassword: '123'}, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_NOT_FOUND);
    }
  });
});

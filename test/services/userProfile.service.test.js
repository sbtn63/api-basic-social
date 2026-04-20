import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { getUserByFullName } from '../../src/services/userProfile.service.js';
import ResponseError from '../../src/schemas/responseError.schema.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('User Profile Test', () => {
  beforeEach(async() => {
    await deleteData(models);
    await models.User.create({ firstName: 'A', lastName: 'B', email: 'a@test.com', passwordHash: '123'});
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
});

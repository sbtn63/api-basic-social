const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { getUserByFullName } = require("../../src/services/userProfile.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

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

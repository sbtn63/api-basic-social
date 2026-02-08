const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../libs/sequelize");
const { deleteData } = require("../utils");
const { createUser, getUserByEmail, getUserProfile } = require("../../services/user.service");
const ResponseError = require("../../schemas/responseError.schema");
const { SERVICE_MESSAGES } = require("../../services/consts");

describe('User Service Test', () => {
  let newUser;

  beforeEach(async() => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
  });

  it('Should create a user with hashed password', async () => {
    const data = {
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    };
    const user = await createUser(data);
    expect(user.firstName).to.be.equal(data.firstName);
    expect(user.lastName).to.be.equal(data.lastName);
    expect(user.email).to.be.equal(data.email);
    expect(user.lastConnection).to.be.not.null;
    expect(user.passwordHash).to.be.a('string');
    expect(user.passwordHash).to.not.equal(data.password);
    expect(user.passwordHash.length).to.be.at.least(20);
  });

  it('Should get a user with email', async () => {
    const email = 'a@test.com';
    const user = await getUserByEmail(email);

    expect(user).to.be.an('object');
  });

  it('Should get a not  user with email', async () => {
    const user = await getUserByEmail('notfound@test.com');
    expect(user).to.be.null;
  });

  it('Should return user profile when user exists', async () => {
    const response = await getUserProfile(newUser.id);
    expect(response).to.be.an('object');
    expect(response.status).to.be.equal(200);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.USER_PROFILE);

    expect(response.data).to.be.an('object');
    expect(response.data.id).to.be.equal(newUser.id);
    expect(response.data.email).to.be.equal(newUser.email);
  });

  it('Should throw error when user does not exist', async () => {
    try {
      await getUserProfile(9999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.USER_NOT_FOUND);
    }
  });
});

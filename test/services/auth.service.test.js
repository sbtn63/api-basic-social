const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { loginUser, registerUser } = require("../../src/services/auth.service");
const { createUser } = require("../../src/services/user.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const ResponseSuccess = require("../../src/schemas/responseSuccess.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

describe('Auth Service Test', () => {
  let body;
  beforeEach(async() => {
    await deleteData(models);
    body = {
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    };
    await createUser(body);
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
});

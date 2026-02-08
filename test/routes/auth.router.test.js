const request = require('supertest');
const app = require('../../app');
const { expect } = require("chai");
const { deleteData } = require('../utils');
const { models } = require('../../libs/sequelize');
const { createUser } = require("../../services/user.service");

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

    console.log(res.body);
    expect(res.body.message).to.be.equal('User register successfully');
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

    console.log(res.body);
    expect(res.body.message).to.be.equal('User login successfully');
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

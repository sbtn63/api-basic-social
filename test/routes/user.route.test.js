const sinon = require('sinon');
const request = require('supertest');
const { expect } = require("chai");
const app = require('../../app');
const { deleteData } = require('../utils');
const { models } = require('../../libs/sequelize');
const { createUser } = require("../../services/user.service");
const generateJwt = require("../../libs/jwt");

describe('GET Profile', () => {
  beforeEach(async () => {
    await deleteData(models);
  });

  it('Should return user profile when authenticated', async () => {
    const user = await createUser({
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    });

    const token = generateJwt(user.id);

    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.email).to.equal("test@gmail.com");
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .expect(401);

    expect(res.body.message).to.equal("No autorizado, token faltante o invalido");
  });
});

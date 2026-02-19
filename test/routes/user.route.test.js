const sinon = require('sinon');
const request = require('supertest');
const { expect } = require("chai");
const app = require('../../src/app');
const { deleteData } = require('../utils');
const { models } = require('../../src/libs/sequelize');
const { createUser } = require("../../src/services/user.service");
const { createFollow } = require("../../src/services/userFollow.service");
const generateJwt = require("../../src/libs/jwt");
const { MIDDLEWARE_MESSAGES } = require('../../src/middleware/const');
const { SERVICE_MESSAGES } = require('../../src/services/consts');

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

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });
});

describe('GET Search Users', () => {
  let newUser;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'Test', lastName: 'Last', email: 'a@test.com', passwordHash: '123'});
  });

  it('Should return users', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get('/api/v1/users/search?fullname=Test')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.USERS_SEARCH);
  });

  it('Should return not users', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get('/api/v1/users/search?fullname=NOTUSER')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND);
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/users/search?fullname=Test')
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should users invalid query', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/users/search`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });
});

describe('Actions Follow', () => {
  let newFollower;
  let newFollowed;
  beforeEach(async () => {
    await deleteData(models);
    newFollower = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newFollowed = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
  });

  it('Should addFollowing not exists', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .post(`/api/v1/users/${newFollowed.id}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(res.body.data.followed).to.equal(true);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.NEW_FOLLOWED);
  });

  it('Should addFollowing exists', async () => {
    const token = generateJwt(newFollower.id);
    await createFollow(newFollower, newFollowed);
    const res = await request(app)
      .post(`/api/v1/users/${newFollowed.id}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(true);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.FOLLOWED_EXISTS);
  });

  it('Should addFollowing return 401 when no token is provided', async () => {
    const res = await request(app)
      .post(`/api/v1/users/${newFollower.id}/follow`)
      .expect(401);
    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should addFollowing invalid param', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .post(`/api/v1/users/test/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });

  it('Should removeFollowing not exists', async () => {
    const token = generateJwt(newFollower.id);
    const res = await request(app)
      .delete(`/api/v1/users/${newFollowed.id}/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(false);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.UNFOLLOW_NOT_FOUND);
  });

  it('Should removeFollowing exists', async () => {
    const token = generateJwt(newFollower.id);
    await createFollow(newFollower, newFollowed);
    const res = await request(app)
      .delete(`/api/v1/users/${newFollowed.id}/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(false);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.UNFOLLOW_SUCCESS);
  });

  it('Should removeFollowing return 401 when no token is provided', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${newFollower.id}/unfollow`)
      .expect(401);
    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should removeFollowing invalid param', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .delete(`/api/v1/users/test/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });
});

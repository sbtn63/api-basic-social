const request = require('supertest');
const { expect } = require("chai");
const app = require('../../src/app');
const { deleteData } = require('../utils');
const { models } = require('../../src/libs/sequelize');
const generateJwt = require("../../src/libs/jwt");
const { MIDDLEWARE_MESSAGES } = require('../../src/middleware/const');
const { SERVICE_MESSAGES } = require('../../src/services/consts');

describe('Actions posts', () => {
  let newUser;
  let newPost;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newPost = await models.Post.create({ description: "Post Test", imageUrl: "http://test.com", userId: newUser.id});
  });

  it('Should create post', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Test 1',
        imageUrl: 'http://test.com',
      })
      .expect(201);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_CREATE);
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should post failed validate schema', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: null,
        imageUrl: null,
      })
      .expect(400);

    expect(res.body.message).to.equal("Validation Error");
  });

  it('Should update post', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .put(`/api/v1/posts/${newPost.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Test 1',
        imageUrl: 'http://test.com',
      })
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_UPDATE);
  });

  it('Should delete post', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .delete(`/api/v1/posts/${newPost.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_DELETE);
  });

  it('Should delete post not found', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .delete(`/api/v1/posts/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });

  it('Should update post not found', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .put(`/api/v1/posts/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });

  it('Should invalid param', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .delete(`/api/v1/posts/test`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });
});

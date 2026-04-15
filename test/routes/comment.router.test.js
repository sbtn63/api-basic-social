const request = require('supertest');
const { expect } = require("chai");
const app = require('../../src/app');
const { deleteData } = require('../utils');
const { models } = require('../../src/libs/sequelize');
const generateJwt = require("../../src/libs/jwt");
const { MIDDLEWARE_MESSAGES } = require('../../src/middleware/const');
const { SERVICE_MESSAGES } = require('../../src/services/consts');


describe('GET Replies', () => {
  let newUser;
  let newPost;
  let newComment;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'Test', lastName: 'Last', email: 'a@test.com', passwordHash: '123'});
    newPost = await models.Post.create({ description: "Post Test", imageUrl: "http://test.com", userId: newUser.id});
    newComment = await models.Comment.create({
      content: 'Test',
      postId: newPost.id,
      userId: newUser.id
    });
    await models.Comment.create({
      content: 'Test Replie',
      postId: newPost.id,
      userId: newUser.id,
      parentCommentId: newComment.id
    });
  });

  it('Should get replies', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/comments/${newComment.id}/replies?offset=0&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.REPLIESCOMMENT_SUCCESS);
    expect(res.body.data.length).to.equal(1);
  });

  it('Should return not replies', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get('/api/v1/comments/9999/replies?offset=0&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.COMMENT_NOT_FOUND);
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get(`/api/v1/comments/${newComment.id}/replies?offset=0&limit=10`)
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should post failed validate schema', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/comments/test/replies?offset=0&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(res.body.message).to.equal("Validation Error");
  });
});


import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';
import { deleteData } from '../utils.js';
import { models } from '../../src/libs/sequelize.js';
import generateJwt from '../../src/libs/jwt.js';
import { MIDDLEWARE_MESSAGES } from '../../src/middleware/const.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('Actions posts', () => {
  let newUser;
  let newPost;
  let newComment;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newPost = await models.Post.create({ description: "Post Test", imageUrl: "http://test.com", userId: newUser.id});
    newComment = await models.Comment.create({
      content: 'Test New Comment',
      postId: newPost.id,
      userId: newUser.id
    });
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

  it('Should create reaction', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reactionId: 1
      })
      .expect(201);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.NEW_POST_REACTION);
  });

  it('Should invalid body reaction', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should reaction not found', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reactionId: 9
      })
      .expect(404);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.REACTION_NOT_EXISTS);
  });

  it('Should post not found', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/99999/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reactionId: 1
      })
      .expect(404);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });

  it('Should post reaction updated', async () => {
    const token = generateJwt(newUser.id);
    await models.PostReaction.create({userId: newUser.id, postId: newPost.id, reactionId: 1});

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reactionId: 2
      })
      .expect(200);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.SET_POST_REACTION);
  });

  it('Should post reaction delete', async () => {
    const token = generateJwt(newUser.id);
    await models.PostReaction.create({userId: newUser.id, postId: newPost.id, reactionId: 1});

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reactionId: 1
      })
      .expect(200);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.DELETE_POST_REACTION);
  });

  it('Should post reaction get', async () => {
    const token = generateJwt(newUser.id);
    await models.PostReaction.create({userId: newUser.id, postId: newPost.id, reactionId: 1});

    const res = await request(app)
      .get(`/api/v1/posts/${newPost.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.REACTIONS_POST_LIST);
  });

  it('Should  reactions a post not found', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/posts/99999/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });

  it('Should create comment', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment'
      })
      .expect(201);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.SAVE_COMMENT_SUCCESS);
  });

  it('Should create comment fail', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/199999/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment'
      })
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });

  it('Should create comment replie', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment',
        parentCommentId: newComment.id
      })
      .expect(201);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.SAVE_COMMENT_SUCCESS);
  });

  it('Should create comment replie fail', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment',
        parentCommentId: 124565
      })
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.PARENTCOMMENT_NOT_FOUND);
  });

  it('Should invalid body comment', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should return 401 when no token create comment', async () => {
    const res = await request(app)
      .post(`/api/v1/posts/${newPost.id}/comments`)
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should update comment', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .put(`/api/v1/posts/${newPost.id}/comments/${newComment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test Update'
      })
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.UPDATE_COMMENT_SUCCESS);
  });

  it('Should update comment invalid update', async () => {
    const token = generateJwt(1211233221);

    const res = await request(app)
      .put(`/api/v1/posts/${newPost.id}/comments/${newComment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test Update'
      })
      .expect(403);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
  });

  it('Should invalid body update comment', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .put(`/api/v1/posts/${newPost.id}/comments/${newComment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should delete comment', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .delete(`/api/v1/posts/${newPost.id}/comments/${newComment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.DELETE_COMMENT_SUCCESS);
  });

  it('Should update comment invalid delete', async () => {
    const token = generateJwt(1211233221);

    const res = await request(app)
      .delete(`/api/v1/posts/${newPost.id}/comments/${newComment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
  });

  it('Should get comments', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/posts/${newPost.id}/comments?offset=0&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.PARENTCOMMENT_SUCCESS);
    expect(res.body.data.length).to.equal(1);
  });

  it('Should get comments not post', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/posts/111001/comments?offset=0&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
  });
});

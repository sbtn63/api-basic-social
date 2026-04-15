const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { createComment, updateComment, deleteComment, getParentCommentsByPost} = require("../../src/services/postComment.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const ResponseSuccess = require("../../src/schemas/responseSuccess.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

describe('postComment Service Test', () => {
  let user;
  let post;
  let comment;
  beforeEach(async() => {
    await deleteData(models);

    user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
    post = await models.Post.create({
      description: "Test1",
      imageUrl : "http://imagetest.com",
      userId: user.id
    });
    comment = await models.Comment.create({
      content: 'Test',
      postId: post.id,
      userId: user.id
    });

    await models.Comment.create({
      content: 'Test Replie',
      postId: post.id,
      userId: user.id,
      parentCommentId: comment.id
    });
  });

  it('Should create a comment', async () => {
    const data = {content: 'Test'};
    const response = await createComment(data, user.id, post.id);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.SAVE_COMMENT_SUCCESS);
    expect(response.data.content).to.be.equal('Test');
    expect(response.status).to.be.equal(201);
  });

  it('Should create a comment replie', async () => {
    const data = {content: 'Test Replie', parentCommentId: comment.id};
    const response = await createComment(data, user.id, post.id);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.SAVE_COMMENT_SUCCESS);
    expect(response.data.content).to.be.equal('Test Replie');
    expect(response.status).to.be.equal(201);
  });

  it('Should throw error when get not PARENT comment', async () => {
    try {
      const data = {content: 'Test Replie', parentCommentId: 1111111};
      await createComment(data, user.id, post.id);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.PARENTCOMMENT_NOT_FOUND);
    }
  });

  it('Should throw error when get not post comment', async () => {
    try {
      const data = {content: 'Test Replie'};
      await createComment(data, user.id, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
    }
  });

  it('Should update a comment', async () => {
    const data = {content: 'Test Update'};
    const params = {commentId: comment.id, id: post.id};
    const response = await updateComment(data, user.id, params);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.UPDATE_COMMENT_SUCCESS);
    expect(response.data.content).to.be.equal('Test Update');
    expect(response.status).to.be.equal(200);
  });

  it('Should throw error when get not comment user update', async () => {
    try {
      const data = {content: 'Test Update'};
      const params = {commentId: comment.id, id: post.id};
      await updateComment(data, 1111111, params);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(403);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
    }
  });

  it('Should delete a comment', async () => {
    const params = {commentId: comment.id, id: post.id};
    const response = await deleteComment(params, user.id);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.DELETE_COMMENT_SUCCESS);
    expect(response.status).to.be.equal(200);
  });

  it('Should throw error when get not comment user update', async () => {
    try {
      const params = {commentId: comment.id, id: post.id};
      await deleteComment(params, 1111111);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(403);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
    }
  });

  it('Should get a parentComments by post', async () => {
    const response = await getParentCommentsByPost(post.id);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.PARENTCOMMENT_SUCCESS);
    expect(response.data.length).to.be.equal(1);
    expect(response.status).to.be.equal(200);
  });

  it('Should throw error when get not post', async () => {
    try {
      await getParentCommentsByPost(111111);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
    }
  });

});

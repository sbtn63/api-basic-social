import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { saveComment, getCommentReplies, getCommentUser, getParentComment } from '../../src/services/comment.service.js';
import ResponseError from '../../src/schemas/responseError.schema.js';
import ResponseSuccess from '../../src/schemas/responseSuccess.schema.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('Comment Service Test', () => {
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
    const data = {content: 'Test', userId: user.id, postId: post.id};
    const newComment = await saveComment(data);
    expect(newComment).to.be.an('object');
    expect(newComment.userId).to.equal(user.id);
    expect(newComment.parentCommentId).to.be.null;
  });

  it('Should create a comment replie', async () => {
    const data = {content: 'Test', userId: user.id, postId: post.id, parentCommentId: comment.id};
    const newComment = await saveComment(data);
    expect(newComment).to.be.an('object');
    expect(newComment.userId).to.equal(user.id);
    expect(newComment.parentCommentId).to.equal(comment.id);
  });

  it('Should update a comment', async () => {
    const data = {content: 'Test Update', userId: user.id, postId: post.id};
    const updateComment = await saveComment(data, comment.id);
    expect(updateComment).to.be.an('object');
    expect(updateComment.userId).to.equal(user.id);
    expect(updateComment.parentCommentId).to.be.null;
  });

  it('Should getReplies', async () => {
    const response = await getCommentReplies(comment.id);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.REPLIESCOMMENT_SUCCESS);
    expect(response.data.length).to.be.equal(1);
    expect(response.status).to.be.equal(200);
  });

  it('Should throw error when get not comment', async () => {
    try {
      await getCommentReplies(9999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.COMMENT_NOT_FOUND);
    }
  });

  it('Should getCommentUser success', async () => {
    const commentUser = await getCommentUser(comment.id, post.id, user.id);
    expect(commentUser).to.be.an('object');
  });

  it('Should getParentComment success', async () => {
    const parentCommentUser = await getParentComment(comment.id, post.id);
    expect(parentCommentUser).to.be.an('object');
  });

  it('Should throw error when get not comment user', async () => {
    try {
      await getCommentUser(9999, 999999, 99999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(403);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
    }
  });

  it('Should throw error when get not PARENT comment', async () => {
    try {
      await getParentComment(9999, 9999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.PARENTCOMMENT_NOT_FOUND);
    }
  });
});

const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { findAllRecentComments } = require("../../src/services/postCommentQuery.service");

describe('PostComment Query Test', () => {
  let post;
  let comment;
  beforeEach(async() => {
    await deleteData(models);
    const user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
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

  it('Should get a post parent comments success', async () => {
    const response = await findAllRecentComments(
      {postId: post.id, parentCommentId: null},
      {limit: 1, offset: 0}
    );
    expect(response).to.be.an('array');
    expect(response.length).to.be.equal(1);
  });

  it('Should get a replies comments success', async () => {
    const response = await findAllRecentComments(
      {parentCommentId: comment.id},
      {limit: 1, offset: 0}
    );
    expect(response).to.be.an('array');
    expect(response.length).to.be.equal(1);
  });

  it('Should get a post reactions success not pagination', async () => {
    const response = await findAllRecentComments({parentCommentId: comment.id});
    expect(response).to.be.an('array');
    expect(response.length).to.be.equal(1);
  });
});

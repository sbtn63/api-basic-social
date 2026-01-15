const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../libs/sequelize");
const { deleteData } = require("../utils");

describe('Comment Model', () => {
  let post;
  let user;
  let comment;

  beforeEach(async() => {
    await deleteData(models);

    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
    comment = await models.Comment.create({content: 'Test Comment', userId: user.id, postId: post.id});
  });

  it('should relation comment', async () => {
    const post = await comment.getPost();
    const user = await comment.getUser();
    expect(post).to.be.an('object');
    expect(user).to.be.an('object');
  });

  it('should self relation comment', async () => {
    const commentParent = await models.Comment.create({
      content: 'Test Comment',
      userId: user.id,
      postId: post.id,
      parentCommentId: comment.id
    });

    const replies = await commentParent.getReplies();
    const parent = await commentParent.getParent();
    expect(replies).to.be.an('array');
    expect(parent).to.be.an('object');
  });

  it('should get comments', async () => {
    const comments = await models.Comment.findAll();
    expect(comments).to.be.an('array');
  });

  it('should insert a new comment', async () => {
    const commentNew = await models.Comment.create({
      content: 'Test Comment',
      userId: user.id,
      postId: post.id
    });

    expect(commentNew).to.be.an('object');
    expect(commentNew.userId).to.equal(user.id);
    expect(commentNew.postId).to.equal(post.id);
  });

  it('should get comment', async () => {
    comment = await models.Comment.findByPk(comment.id);
    expect(comment).to.not.be.null;
  });

  it('should update comment', async () => {
    comment.content = 'TestUpdate';
    await comment.save();
    expect(comment.content).to.equal('TestUpdate');
  });

  it('should delete comment', async () => {
    await comment.destroy();
    const deleteComment = await models.Comment.findByPk(comment.id);
    expect(deleteComment).to.be.null;
  });
});

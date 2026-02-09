const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");

describe('Post Model', () => {
  let post;
  let user;

  beforeEach(async() => {
    await deleteData(models);

    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
    await models.Comment.create({content: 'Test Comment', userId: user.id, postId: post.id});
  });

  it('should get post comments', async () => {
    const postComments = await post.getComments();
    expect(postComments).to.be.an('array');
    expect(postComments[0].userId).to.equal(user.id);
    expect(postComments[0].postId).to.equal(post.id);
  });

  it('should get post reactions', async () => {
    const reactionsFull = await post.getReactions();
    const reactionsBasic = await post.getPostReactions();
    expect(reactionsFull).to.be.an('array');
    expect(reactionsBasic).to.be.an('array');
  });

  it('should get posts', async () => {
    const posts = await models.Post.findAll();
    expect(posts).to.be.an('array');
  });

  it('should insert a new post', async () => {
    const postNew = await models.Post.create({
      description: 'Test1',
      imageUrl: 'https://images/test.png',
      userId: user.id
    });

    expect(postNew).to.be.an('object');
    expect(postNew.userId).to.equal(user.id);
  });

  it('should get post', async () => {
    post = await models.Post.findByPk(post.id);
    expect(post).to.not.be.null;
  });

  it('should update post', async () => {
    post.description = 'TestUpdate';
    await post.save();
    expect(post.description).to.equal('TestUpdate');
  });

  it('should delete post', async () => {
    await post.destroy();
    const deletePost = await models.Post.findByPk(post.id);
    expect(deletePost).to.be.null;
  });

  it('should validate notContent', async () => {
    try {
     await models.Post.create({
      userId : user.id
     });
     throw new Error("Debio recibir un error!!")
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error.errors[0].message).to.equal("Se debe ingresar una imagen o descripción");
    }
  });
});

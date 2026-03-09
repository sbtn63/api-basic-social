const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { createPost, savePost, updatePost, deletePost, getPostUser, getPost} = require("../../src/services/post.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const ResponseSuccess = require("../../src/schemas/responseSuccess.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

describe('Post Service Test', () => {
  let user;
  let post;
  let body;
  beforeEach(async() => {
    await deleteData(models);
    body = { description: "Test", imageUrl: "http://test.com"};
    user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
    post = await models.Post.create({
      description: "Test1",
      imageUrl : "http://imagetest.com",
      userId: user.id
    });
  });

  it('Should register a post success', async () => {
    const response = await createPost(body, user.id);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.POST_CREATE);
    expect(response.data.userId).to.be.equal(user.id);
    expect(response.status).to.be.equal(201);
  });

  it('Should update a post success', async () => {
    body.description = "Test Post Update";
    const response = await updatePost(body, user.id, post.id);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.POST_UPDATE);
    expect(response.data.description).to.be.equal("Test Post Update");
    expect(response.status).to.be.equal(200);
  });

  it('Should delete a post success', async () => {
    const response = await deletePost(post.id, user.id);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.POST_DELETE);
    expect(response.status).to.be.equal(200);
  });

  it('Should save post success null description', async () => {
    body.description = null;
    const response = await savePost(body, user.id);
    expect(response).to.be.an('object');
    expect(response.imageUrl).to.be.equal(body.imageUrl);
    expect(response.description).to.be.null;
  });

  it('Should save post success null imageUrl', async () => {
    body.imageUrl = null;
    const response = await savePost(body, user.id);
    expect(response).to.be.an('object');
    expect(response.description).to.be.equal(body.description);
    expect(response.imageUrl).to.be.null;
  });

  it('Should save post update success', async () => {
    body.imageUrl = "http://new-image.com";
    const response = await savePost(body, user.id, post.id);
    expect(response).to.be.an('object');
    expect(response.imageUrl).to.be.equal(body.imageUrl);
  });

  it('Should get user a post success', async () => {
    const postUser = await getPostUser(post.id, user.id);
    expect(postUser).to.be.an('object');
    expect(postUser.userId).to.be.equal(user.id);
  });

  it('Should throw error when get user a post', async () => {
    try {
      await getPostUser(9999, 9999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
    }
  });

  it('Should get a post success', async () => {
    const postUser = await getPost(post.id);
    expect(postUser).to.be.an('object');
    expect(postUser.userId).to.be.equal(user.id);
  });

  it('Should throw error when get a post', async () => {
    try {
      await getPost(9999);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.POST_NOT_FOUND);
    }
  });
});


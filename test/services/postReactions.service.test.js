const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { toggleReaction, processReactionAction, updateReactionId, findOrCreatePostReaction, getReactionAndPostContext, getReactionById } = require("../../src/services/postReactions.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const ResponseSuccess = require("../../src/schemas/responseSuccess.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

describe('Post Reactions Service Test', () => {
  let user;
  let post;
  let body;
  let reaction;
  beforeEach(async() => {
    await deleteData(models);
    reaction = await models.Reaction.findByPk(1);
    body = { reactionId: 1};
    user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
    post = await models.Post.create({
      description: "Test1",
      imageUrl : "http://imagetest.com",
      userId: user.id
    });
  });

  it('Should register a post reaction success', async () => {
    const response = await toggleReaction(post.id, user.id, body);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.NEW_POST_REACTION);
    expect(response.data.userId).to.be.equal(user.id);
    expect(response.data.postId).to.be.equal(post.id);
    expect(response.status).to.be.equal(201);
  });

  it('Should set a post reaction success', async () => {
    body.reactionId = 2;
    await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const response = await toggleReaction(post.id, user.id, body);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.SET_POST_REACTION);
    expect(response.data.userId).to.be.equal(user.id);
    expect(response.data.postId).to.be.equal(post.id);
    expect(response.status).to.be.equal(200);
  });

  it('Should delete a post reaction success', async () => {
    body.reactionId = 2;
    await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 2});
    const response = await toggleReaction(post.id, user.id, body);
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.DELETE_POST_REACTION);
    expect(response.data.userId).to.be.equal(user.id);
    expect(response.data.postId).to.be.equal(post.id);
    expect(response.status).to.be.equal(200);
  });

  it('Should findOrCreate create PostReaction success', async () => {
    const [response, created] = await findOrCreatePostReaction(post.id, user.id, body.reactionId);
    expect(response).to.be.an('object');
    expect(created).to.be.equal(true);
  });

  it('Should findOrCreate find PostReaction success', async () => {
    await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const [response, created] = await findOrCreatePostReaction(post.id, user.id, body.reactionId);
    expect(response).to.be.an('object');
    expect(created).to.be.equal(false);
  });

  it('Should getReaction success', async () => {
    const response = await getReactionById(body.reactionId);
    expect(response).to.be.an('object');
    expect(response.id).to.be.equal(body.reactionId);
  });

  it('Should throw error when getReaction', async () => {
    try {
      const reaction = await getReactionById(11);
      console.log(reaction);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(404);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.REACTION_NOT_EXISTS);
    }
  });

  it('Should getPostAndReactionContext success', async () => {
    const response = await getReactionAndPostContext(body.reactionId, post.id);
    expect(response.post).to.be.an('object');
    expect(response.reaction).to.be.an('object');
  });

  it('Should update a post reaction success', async () => {
    const postReaction = await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const response = await updateReactionId(postReaction, 2);
    expect(response.reactionId).to.be.equal(2);
  });

  it('Should create a process post reaction', async () => {
    const postReaction = await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const data = await getReactionAndPostContext(1, post.id);
    const response = await processReactionAction(postReaction, data, 'CREATE');
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.NEW_POST_REACTION);
  });

  it('Should update a process post reaction', async () => {
    const postReaction = await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const data = await getReactionAndPostContext(1, post.id);
    const response = await processReactionAction(postReaction, data, 'UPDATE');
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.SET_POST_REACTION);
  });

  it('Should update a process post reaction', async () => {
    const postReaction = await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
    const data = await getReactionAndPostContext(1, post.id);
    const response = await processReactionAction(postReaction, data, 'DELETE');
    expect(response.data).to.be.an('object');
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.DELETE_POST_REACTION);
  });
});


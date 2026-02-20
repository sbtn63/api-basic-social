const { expect } = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");

describe('Post Model', () => {
  let post;
  let user;
  let reaction;

  beforeEach(async() => {
    await deleteData(models);

    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
    reaction = await models.Reaction.findByPk(1);
  });

  it('should insert a new post reaction', async () => {
    const userReaction = await models.PostReaction.findOne({
      where: {
        postId: post.id,
        userId: user.id
      }
    });

    expect(userReaction).to.be.null;

    const postReactionNew = await models.PostReaction.create({
      postId: post.id,
      userId: user.id,
      reactionId: reaction.id
    });

    expect(postReactionNew).to.be.an('object');
    expect(postReactionNew.userId).to.equal(user.id);
    expect(postReactionNew.reactionId).to.equal(reaction.id);
    expect(postReactionNew.postId).to.equal(post.id);
  });

  it('should self relation post reactions', async () => {
    const postReactionNew = await models.PostReaction.create({
      postId: post.id,
      userId: user.id,
      reactionId: reaction.id
    });

    const user2 = await postReactionNew.getUser();
    const post2 = await postReactionNew.getPost();
    const reaction2 = await postReactionNew.getReaction();

    expect(user2).to.be.an('object');
    expect(post2).to.be.an('object');
    expect(reaction2).to.be.an('object');
  });
});

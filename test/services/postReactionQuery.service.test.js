import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { findAllRecentReactionsPost } from '../../src/services/postReactionQuery.service.js';

describe('PostReaction Query Test', () => {
  let user;
  let post;
  beforeEach(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
    post = await models.Post.create({
      description: "Test1",
      imageUrl : "http://imagetest.com",
      userId: user.id
    });
    await models.PostReaction.create({userId: user.id, postId: post.id, reactionId: 1});
  });

  it('Should get a post reactions success', async () => {
    const response = await findAllRecentReactionsPost(post.id, {limit: 1, offset: 0});
    expect(response).to.be.an('array');
    expect(response[0].reaction.id).to.be.equal(1);
  });

  it('Should get a post reactions success not pagination', async () => {
    const response = await findAllRecentReactionsPost(post.id);
    expect(response).to.be.an('array');
    expect(response[0].reaction.id).to.be.equal(1);
  });
});

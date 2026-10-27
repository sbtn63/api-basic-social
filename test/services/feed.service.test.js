import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { createFollow} from '../../src/services/userFollow.service.js';
import { feed, findAllPosts, findPostFollowersUser } from '../../src/services/feed.service.js';
import ResponseSuccess from '../../src/schemas/responseSuccess.schema.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('FEED Test', () => {
  let newFollower;
  let newFollowed;

  beforeEach(async() => {
    await deleteData(models);
    newFollower = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newFollowed = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
    await createFollow(newFollower, newFollowed);
    await models.Post.create({description: "Post 1", userId: newFollowed.id});
    await models.Post.create({description: "Post 2", userId: newFollower.id});
    await models.Post.create({description: "Post 3", userId: newFollower.id});
  });

  it('Should Validate Feed 1 ', async () => {
    const response = await feed(newFollower.id);
    expect(response.data).to.be.an('array');
    expect(response.data.length).equal(1);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.POST_LIST);
    expect(response.status).to.be.equal(200);
  });

  it('Should Validate Feed 2', async () => {
    const response = await feed(newFollowed.id);
    expect(response.data).to.be.an('array');
    expect(response.data.length).equal(3);
    expect(response).to.be.instanceOf(ResponseSuccess);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.POST_LIST);
    expect(response.status).to.be.equal(200);
  });

  it('Should Validate Feed All', async () => {
    const posts = await findAllPosts(newFollowed.id);
    expect(posts).to.be.an('array');
    expect(posts.length).equal(3);
  });

  it('Should Validate Feed Followers', async () => {
    const posts = await findPostFollowersUser([newFollowed.id]);
    expect(posts).to.be.an('array');
    expect(posts.length).equal(1);
  });
});

const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { addFollowing, removeFollowing, createFollow, getActors, getFollow, ensureNotSelfFollowing } = require("../../src/services/userFollow.service");
const ResponseError = require("../../src/schemas/responseError.schema");
const { SERVICE_MESSAGES } = require("../../src/services/consts");

describe('User Follow Test', () => {
  let newFollower;
  let newFollowed;
  let testFollower;
  let testFollowed;

  beforeEach(async() => {
    await deleteData(models);
    newFollower = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newFollowed = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
    testFollower = await models.User.create({ firstName: 'C', email: 'c@test.com', passwordHash: '123'});
    testFollowed = await models.User.create({ firstName: 'D', email: 'd@test.com', passwordHash: '123'});
    await createFollow(newFollower, newFollowed);
  });

  it('Should ensured Not self following failed', async () => {

    try {
      ensureNotSelfFollowing(newFollower.id, newFollower.id, SERVICE_MESSAGES.FOLLOWING_CONFLICT);
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error).to.be.instanceOf(ResponseError);
      expect(error.status).to.be.equal(409);
      expect(error.message).to.be.equal(SERVICE_MESSAGES.FOLLOWING_CONFLICT);
    }

  });

  it('Should get follow and follower', async () => {
    const { follower, followed } = await getActors(newFollower.id, newFollowed.id, SERVICE_MESSAGES.FOLLOWING_CONFLICT);
    expect(follower).to.be.an('object');
    expect(follower.email).to.be.equal('a@test.com');
    expect(followed).to.be.an('object');
    expect(followed.email).to.be.equal('b@test.com');
  });

  it('Should get follow', async () => {
    const follow = await getFollow(newFollower, newFollowed);
    expect(follow).to.be.an('object');
    expect(follow.followedId).to.be.equal(newFollowed.id);
    expect(follow.followerId).to.be.equal(newFollower.id);
  });

  it('Should not get follow', async () => {
    const follow = await getFollow(newFollowed, newFollowed);
    expect(follow).to.be.null;
  });

  it('Should create follow', async () => {
    const following = await createFollow(testFollower, testFollowed);
    expect(following).to.be.an('object');
    expect(following.followedId).to.be.equal(testFollowed.id);
    expect(following.followerId).to.be.equal(testFollower.id);
  });

  it('Should add follow new', async () => {
    const response = await addFollowing(testFollower.id, testFollowed.id);
    expect(response).to.be.an('object');
    expect(response.status).to.be.equal(201);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.NEW_FOLLOWED);

    expect(response.data).to.be.an('object');
    expect(response.data.followed).to.be.equal(true);
  });

  it('Should add follow exists', async () => {
    const response = await addFollowing(newFollower.id, newFollowed.id);
    expect(response).to.be.an('object');
    expect(response.status).to.be.equal(200);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.FOLLOWED_EXISTS);

    expect(response.data).to.be.an('object');
    expect(response.data.followed).to.be.equal(true);
  });

  it('Should remove follow not exists', async () => {
    const response = await removeFollowing(testFollower.id, testFollowed.id);
    expect(response).to.be.an('object');
    expect(response.status).to.be.equal(200);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.UNFOLLOW_NOT_FOUND);

    expect(response.data).to.be.an('object');
    expect(response.data.followed).to.be.equal(false);
  });

  it('Should remove follow exists', async () => {
    const response = await removeFollowing(newFollower.id, newFollowed.id);
    expect(response).to.be.an('object');
    expect(response.status).to.be.equal(200);
    expect(response.message).to.be.equal(SERVICE_MESSAGES.UNFOLLOW_SUCCESS);

    expect(response.data).to.be.an('object');
    expect(response.data.followed).to.be.equal(false);
  });
});

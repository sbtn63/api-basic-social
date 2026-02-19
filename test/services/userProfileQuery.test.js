const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { getFollowersCountLiteral, getFollowingCountLiteral, findUsersByFullNameByInfluence } = require("../../src/services/userProfileQuery.service");

describe('User Profile Query Test', () => {
  let userA, userB;

  beforeEach(async () => {
    await deleteData(models);

    userA = await models.User.create({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', passwordHash: '123' });
    userB = await models.User.create({ firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', passwordHash: '123' });

    await models.UserFollow.create({
      followerId: userA.id,
      followedId: userB.id
    });
  });

  it('Should get users by fullname', async () => {
    const users = await findUsersByFullNameByInfluence('john doe', { limit: 1, offset: 0 });

    expect(users).to.be.an('array');
    expect(users[0].firstName).to.equal('John');
  });

  it('Should get users by fullname not pagination', async () => {
    const users = await findUsersByFullNameByInfluence('john doe');

    expect(users).to.be.an('array');
    expect(users[0].firstName).to.equal('John');
  });

  it('Should return correct influence counts (followers/following)', async () => {
    const result = await models.User.findByPk(userB.id, {
      attributes: [
        'id',
        getFollowersCountLiteral(),
        getFollowingCountLiteral()
      ]
    });

    const userData = result.get({ plain: true });

    expect(userData).to.have.property('followersCount');
    expect(userData).to.have.property('followingCount');

    expect(Number(userData.followersCount)).to.equal(1);
    expect(Number(userData.followingCount)).to.equal(0);
  });
});

const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");

describe('User Model', () => {
  let user;
  it('shoud get users', async () => {
    const users = await models.User.findAll();
    expect(users).to.be.an('array');
  });

  it('should insert a new user', async () => {
    user = await models.User.create({
      firstName: 'Test1',
      lastName: 'Test1',
      avatarUrl: 'https://images/test.png',
      email: 'test1@gmail.com',
      passwordHash: 'jjavvhayyacceggaga'
    });

    expect(user).to.be.an('object');
  });

  it('should filter fullname user', async () => {
    const fullname = 'Test1 Test'
    const users = await models.User.searchByFullName(fullname);
    expect(users).to.be.an('array');
    expect(users[0].id).to.equal(user.id);
  });

  it('shoud get user', async () => {
    user = await models.User.findByPk(user.id);
    expect(user).to.not.be.null;
  });

  it('shoud update user', async () => {
    user.firstName = 'TestUpdate';
    await user.save();
    expect(user.firstName).to.equal('TestUpdate');
  });

  it('should delete user', async () => {
    await user.destroy();
    const deleteUser = await models.User.findByPk(user.id);
    expect(deleteUser).to.be.null;
  });
});

describe('Validate Posts', () => {
  let user1;
  beforeEach(async() => {
    await deleteData(models);
    user1 = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    await models.Post.create({description: 'Test1', userId: user1.id});
  });

  it('should get posts', async () => {
    const posts = await user1.getPosts();
    expect(posts).to.be.an('array');
    expect(posts[0].userId).to.equal(user1.id);
  });

});

describe('Validate Reactions', () => {
  let user1;
  beforeEach(async() => {
    await deleteData(models);
    user1 = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
  });

  it('should get posts', async () => {
    const reactions = await user1.getReactions();
    expect(reactions).to.be.an('array');
  });

});

describe('Validate User Notifications', () => {
  let user1;
  beforeEach(async() => {
    await deleteData(models);
    user1 = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
  });

  it('should get User Notifications', async () => {
    const notifications = await user1.getNotifications();
    expect(notifications).to.be.an('array');
  });

});

describe('Validate Followers', () => {
  let user1;
  let user2;
  beforeEach(async() => {
    await deleteData(models);

    user1 = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    user2 = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
  });

  it('should add followings', async () => {
    const following = await user1.addFollowing(user2);
    expect(following).to.be.an('array');
    expect(following[0].followedId).to.equal(user2.id);
  });

  it('should add followers', async () => {
    const following = await user1.addFollower(user2);
    expect(following).to.be.an('array');
    expect(following[0].followerId).to.equal(user2.id);
  });

  it('should add followers', async () => {
    const following = await user1.addFollower(user2);
    expect(following).to.be.an('array');
    expect(following[0].followerId).to.equal(user2.id);
  });

  it('should unfollow a user', async () => {
      await user1.addFollowing(user2);
      await user1.removeFollowing(user2);

      const following = await user1.getFollowing();
      expect(following).to.be.an('array').that.is.empty;

      const followers = await user2.getFollowers();
      expect(followers).to.be.an('array').that.is.empty;
  });

  it('should validate followers', async () => {
    try {
     await models.UserFollow.create({
      followerId: user1.id,
      followedId: user1.id
     });
     throw new Error("Debio recibir un error!!")
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error.errors[0].message).to.equal("No puedes seguirte a ti mismo");
    }
  });
});

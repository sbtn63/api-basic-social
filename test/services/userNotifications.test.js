const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");
const { TABLE_NAMES, TYPE_NOTIFICATION } = require("../../src/services/consts");
const { insertUserNotification, readUserNotification, deleteUserNotification } = require("../../src/services/userNotifications.service");

describe('Notifications User Service', () => {
  let user;
  let post;

  before(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
  });

  it('Validation INSERT user notification', async () => {
    const userNotification = await insertUserNotification(
      user.id,
      user.id,
      TYPE_NOTIFICATION.NEW_POST,
      post.id,
      null,
      "Post insert success"
    );

    expect(userNotification).to.equal(true);
  });

  it('Validation Insert user failed', async () => {
    const userNotification = await insertUserNotification(
      null,
      user.id,
      TYPE_NOTIFICATION.NEW_POST,
      post.id,
      null,
      "Post insert success"
    );

    expect(userNotification).to.equal(false);
  });

  it('Validation Update user notification', async () => {
    const lastNotification = await models.UserNotification.findOne({
      order: [['id', 'DESC']]
    });

    expect(lastNotification).to.be.an('object');
    const readNotification = await readUserNotification(lastNotification.id);
    expect(readNotification).to.equal(true);
  });

  it('Validation Update user failed', async () => {
    const readNotification = await readUserNotification(null);
    expect(readNotification).to.equal(false);
  });

  it('Validation Delete user failed', async () => {
    const deleteNotification = await deleteUserNotification(null);
    expect(deleteNotification).to.equal(false);
  });

  it('Validation Delete user notification', async () => {
    const lastNotification = await models.UserNotification.findOne({
      order: [['id', 'DESC']]
    });

    expect(lastNotification).to.be.an('object');
    const deleteNotification = await deleteUserNotification(lastNotification.id);
    expect(deleteNotification).to.equal(true);
  });
});

import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { TYPE_NOTIFICATION } from '../../src/services/consts.js';
import { insertUserNotification, readUserNotification, deleteUserNotification } from '../../src/services/userNotifications.service.js';

describe('Notifications User Service', () => {
  let user;
  let post;

  before(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
  });

  it('Validation INSERT user notification', async () => {
    const userNotification = await insertUserNotification({
      toUserId: user.id,
      fromUserId: user.id,
      typeNotificationId: TYPE_NOTIFICATION.NEW_POST,
      postId: post.id,
      message: "Post insert success"
    });

    expect(userNotification).to.equal(true);
  });

  it('Validation Insert user failed', async () => {
    const userNotification = await insertUserNotification({});
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

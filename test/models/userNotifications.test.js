const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../src/libs/sequelize");
const { deleteData } = require("../utils");

describe('Post Model', () => {
  let post;
  let toUser;
  let comment;
  let fromUser;

  beforeEach(async() => {
    await deleteData(models);

    toUser = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    fromUser = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: fromUser.id});
    comment = await models.Comment.create({content: 'Test Comment', userId: fromUser.id, postId: post.id});
  });

  it('should relations user notifications', async () => {
    const userNotification = await models.UserNotification.create({
      toUserId: toUser.id,
      fromUserId: fromUser.id,
      typeNotificationId: 3,
      postId: post.id,
      commentId: comment.id,
      message: "test from notifications"
    });

    expect(userNotification).to.be.an('object');

    const toUserNotification = await userNotification.getToUser();
    const fromUserNotification = await userNotification.getFromUser();
    const postUserNotification = await userNotification.getPost();
    const commentUserNotification = await userNotification.getComment();
    const typeNotificationUserNotification = await userNotification.getTypeNotification();

    expect(toUserNotification.id).to.equal(toUser.id);
    expect(fromUserNotification.id).to.equal(fromUser.id);
    expect(postUserNotification.id).to.equal(post.id);
    expect(commentUserNotification.id).to.equal(comment.id);
    expect(typeNotificationUserNotification.id).to.equal(3);
    expect(userNotification.isRead).to.equal(false);
  });
});

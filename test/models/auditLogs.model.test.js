const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../libs/sequelize");
const { deleteData } = require("../utils");

describe('Post Model', () => {
  let post;
  let user;

  beforeEach(async() => {
    await deleteData(models);

    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    post = await models.Post.create({description: 'Test1', userId: user.id});
  });

  it('should insert audit logs', async () => {
    const auditLog = await models.AuditLog.create({
      userId: user.id,
      action: "INSERT",
      tableName: "posts",
      recordId: post.id,
      newData: post
    });

    expect(auditLog).to.be.an('object');
  });
});

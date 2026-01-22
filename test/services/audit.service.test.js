const { expect } = require("chai");
const chai = require("chai");

const { models } = require("../../libs/sequelize");
const { deleteData } = require("../utils");
const { ACTIONS_AUDIT } = require("../../services/consts");
const { insertAuditLog } = require("../../services/audit.service");

describe('Audit Service', () => {
  let user;

  beforeEach(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
  });

  it('Validation INSERT services audit', async () => {
    const audit = await insertAuditLog(user.id, ACTIONS_AUDIT.INSERT, "users", user.id, null, user);
    expect(audit).to.equal(true);
  });

  it('Validation UPDATE services audit', async () => {
    const oldUser = user.toJSON();
    user.email = "testaudit@gmail.com";
    await user.save();
    const audit = await insertAuditLog(user.id, ACTIONS_AUDIT.UPDATE, "users", user.id, oldUser, user.toJSON());
    expect(audit).to.equal(true);
  });

  it('Validation DELETE services audit', async () => {
    const userB = await models.User.create({ firstName: 'B', email: 'w@test.com', passwordHash: '123'});
    const userDelete = user.toJSON();
    await user.destroy();
    const audit = await insertAuditLog(userB.id, ACTIONS_AUDIT.DELETE, "users", userDelete.id, userDelete, null);
    expect(audit).to.equal(true);
  });

  it('Validation Error services audit', async () => {
    const audit = await insertAuditLog(null, null, "users", user.id, null, user);
    expect(audit).to.equal(false);
  });
});

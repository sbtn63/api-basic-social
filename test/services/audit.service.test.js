import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { ACTIONS_AUDIT } from '../../src/services/consts.js';
import { insertAuditLog } from '../../src/services/audit.service.js';

describe('Audit Service', () => {
  let user;

  beforeEach(async() => {
    await deleteData(models);
    user = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
  });

  it('Validation INSERT services audit', async () => {
    const audit = await insertAuditLog({
      userId: user.id,
      action: ACTIONS_AUDIT.INSERT,
      tableName: "users",
      recordId: user.id,
      newData: user});
    expect(audit).to.equal(true);
  });

  it('Validation UPDATE services audit', async () => {
    const oldUser = user.toJSON();
    user.email = "testaudit@gmail.com";
    await user.save();
    const audit = await insertAuditLog({
      userId: user.id,
      action: ACTIONS_AUDIT.UPDATE,
      tableName: "users",
      recordId: user.id,
      oldData: oldUser,
      newData: user.toJSON()
    });
    expect(audit).to.equal(true);
  });

  it('Validation DELETE services audit', async () => {
    const userB = await models.User.create({ firstName: 'B', email: 'w@test.com', passwordHash: '123'});
    const userDelete = user.toJSON();
    await user.destroy();
    const audit = await insertAuditLog({
      userId: userB.id,
      action: ACTIONS_AUDIT.DELETE,
      tableName: "users",
      recordId: userDelete.id,
      oldData: userDelete
    });
    expect(audit).to.equal(true);
  });

  it('Validation Error services audit', async () => {
    const audit = await insertAuditLog({});
    expect(audit).to.equal(false);
  });
});

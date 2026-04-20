import { expect } from 'chai';

import { models } from '../../src/libs/sequelize.js';
import { deleteData } from '../utils.js';
import { findUsersByFullNameByInfluence } from '../../src/services/userProfileQuery.service.js';

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

});

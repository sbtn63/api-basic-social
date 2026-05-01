import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';
import { deleteData } from '../utils.js';
import { models } from '../../src/libs/sequelize.js';
import { createUser } from '../../src/services/user.service.js';
import { createFollow } from '../../src/services/userFollow.service.js';
import generateJwt from '../../src/libs/jwt.js';
import { MIDDLEWARE_MESSAGES } from '../../src/middleware/const.js';
import { SERVICE_MESSAGES } from '../../src/services/consts.js';

describe('Profile Actions', () => {
  let newUser;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await createUser({ firstName: 'A', lastName: 'B', email: 'a@test.com', password: '12345678'});
    await models.User.create({ firstName: 'B', lastName: 'C', email: 'b@test.com', passwordHash: '123'});
  });

  it('Should return user profile when authenticated', async () => {
    const user = await createUser({
      firstName: "Test FirstName",
      lastName: "Test LastName",
      email: "test@gmail.com",
      password: "testpassword1"
    });

    const token = generateJwt(user.id);

    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.email).to.equal("test@gmail.com");
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should update user profile when authenticated', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'firstName': "Test Profile Update",
        "lastName" : "Test Profile Update"
      })
      .expect(200);

    expect(res.body.data.firstName).to.equal("Test Profile Update");
    expect(res.body.data.lastName).to.equal("Test Profile Update");
  });

  it('Should invalid body update profile', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should update user avatar when authenticated', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch('/api/v1/users/avatar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "avatarUrl": "https://avatar.url.com"
      })
      .expect(200);

    expect(res.body.data.avatarUrl).to.equal("https://avatar.url.com");
  });

  it('Should invalid body update avatar', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "avatarUrl": "invalid"
      })
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should update user email when authenticated', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch('/api/v1/users/email')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "newEmail": "newEmail@test.com"
      })
      .expect(200);

    expect(res.body.data.email).to.equal("newEmail@test.com");
  });

  it('Should invalid body update email', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/email`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "newEmail": "invalid"
      })
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should exists update email', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/email`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "newEmail": "b@test.com"
      })
    .expect(209);

    expect(res.body.message).to.be.equal(SERVICE_MESSAGES.EMAIL_EXISTS);
  });

  it('Should update user password when authenticated', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch('/api/v1/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "currentPassword": "12345678",
        "newPassword": "123456789",
        "confirmPassword": "123456789"
      })
      .expect(200);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
  });

  it('Should invald body update password', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "currentPassword": "12345678",
        "newPassword": "12345678"
      })
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should invald newPassword and confirmPassword not match', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "currentPassword": "123456789",
        "newPassword": "12345678",
        "confirmPassword": "123456789"
      })
    .expect(400);

    expect(res.body.data).to.be.an('object');
  });

  it('Should incorrect password', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .patch(`/api/v1/users/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        "currentPassword": "testpassword",
	      "newPassword": "testpassword",
	      "confirmPassword": "testpassword"
      })
    .expect(400);

    expect(res.body.message).to.be.equal(SERVICE_MESSAGES.CREDENTIALS_INVALID);
  });
});

describe('GET Search Users', () => {
  let newUser;
  beforeEach(async () => {
    await deleteData(models);
    newUser = await models.User.create({ firstName: 'Test', lastName: 'Last', email: 'a@test.com', passwordHash: '123'});
  });

  it('Should return users', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get('/api/v1/users/search?fullname=Test')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.USERS_SEARCH);
  });

  it('Should return not users', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get('/api/v1/users/search?fullname=NOTUSER')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).to.equal(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND);
  });

  it('Should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/users/search?fullname=Test')
      .expect(401);

    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should users invalid query', async () => {
    const token = generateJwt(newUser.id);

    const res = await request(app)
      .get(`/api/v1/users/search`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });
});

describe('Actions Follow', () => {
  let newFollower;
  let newFollowed;
  beforeEach(async () => {
    await deleteData(models);
    newFollower = await models.User.create({ firstName: 'A', email: 'a@test.com', passwordHash: '123'});
    newFollowed = await models.User.create({ firstName: 'B', email: 'b@test.com', passwordHash: '123'});
  });

  it('Should addFollowing not exists', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .post(`/api/v1/users/${newFollowed.id}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(res.body.data.followed).to.equal(true);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.NEW_FOLLOWED);
  });

  it('Should addFollowing exists', async () => {
    const token = generateJwt(newFollower.id);
    await createFollow(newFollower, newFollowed);
    const res = await request(app)
      .post(`/api/v1/users/${newFollowed.id}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(true);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.FOLLOWED_EXISTS);
  });

  it('Should addFollowing return 401 when no token is provided', async () => {
    const res = await request(app)
      .post(`/api/v1/users/${newFollower.id}/follow`)
      .expect(401);
    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should addFollowing invalid param', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .post(`/api/v1/users/test/follow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });

  it('Should removeFollowing not exists', async () => {
    const token = generateJwt(newFollower.id);
    const res = await request(app)
      .delete(`/api/v1/users/${newFollowed.id}/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(false);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.UNFOLLOW_NOT_FOUND);
  });

  it('Should removeFollowing exists', async () => {
    const token = generateJwt(newFollower.id);
    await createFollow(newFollower, newFollowed);
    const res = await request(app)
      .delete(`/api/v1/users/${newFollowed.id}/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.followed).to.equal(false);
    expect(res.body.message).to.equal(SERVICE_MESSAGES.UNFOLLOW_SUCCESS);
  });

  it('Should removeFollowing return 401 when no token is provided', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${newFollower.id}/unfollow`)
      .expect(401);
    expect(res.body.message).to.equal(MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  });

  it('Should removeFollowing invalid param', async () => {
    const token = generateJwt(newFollower.id);

    const res = await request(app)
      .delete(`/api/v1/users/test/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.data).to.be.an('object');
  });
});

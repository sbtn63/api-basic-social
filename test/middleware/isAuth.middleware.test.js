import { expect } from 'chai';
import sinon from 'sinon';
import isAuth from '../../src/middleware/isAuth.middleware.js';
import { MIDDLEWARE_MESSAGES } from '../../src/middleware/const.js';

describe('Middleware isAuth', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      sendResponse: sinon.stub()
    };
    next = sinon.spy();
  });

  it('401 req.auth not exists', () => {
    req.auth = null;
    isAuth(req, res, next);
    expect(res.sendResponse.calledOnceWith(401, MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN)).to.be.true;
    expect(next.called).to.be.false;
  });

  it('Call next() req.auth not exists', () => {
    req.auth = { user: 'test' };
    isAuth(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(res.sendResponse.called).to.be.false;
  });
});

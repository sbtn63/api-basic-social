const { expect } = require('chai');
const sinon = require('sinon');
const isAuth  = require('../../middleware/isAuth.middleware');

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
    expect(res.sendResponse.calledOnceWith(401, "No autorizado, token faltante o invalido")).to.be.true;
    expect(next.called).to.be.false;
  });

  it('Call next() req.auth not exists', () => {
    req.auth = { user: 'test' };
    isAuth(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(res.sendResponse.called).to.be.false;
  });
});

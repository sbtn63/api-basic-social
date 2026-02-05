const { expect } = require('chai');
const sinon = require('sinon');
const responseFormat = require('../../middleware/responseFormat.middleware');

describe('Middleware responseFormat', () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: '/api/test' };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.spy();
  });

  it('Validate next y responseSend', () => {
    responseFormat(req, res, next);
    expect(res.sendResponse).to.be.a('function');
    expect(next.calledOnce).to.be.true;
  });

  it('Validate data response', () => {
    responseFormat(req, res, next);

    const mockData = { id: 1, name: 'JWT Test' };
    res.sendResponse(200, "Éxito", mockData);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({
      status: 200,
      message: "Éxito",
      data: mockData,
      path: '/api/test'
    })).to.be.true;
  });

});

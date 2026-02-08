const { expect } = require("chai");
const sinon = require("sinon");

const errorHandler = require("../../middleware/errorHandler.middleware");
const { MIDDLEWARE_MESSAGES } = require("../../middleware/const");

describe("Error Handler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: '/test-route'};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
  });

  it("Return status y message error", () => {
    const err = {
      status: 404,
      message: "Not found",
      details: { id: 1},
    };

    errorHandler(err, req, res, next);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({
      status: 404,
      message: "Not found",
      data: { id: 1},
      path: "/test-route"
    });
  });

  it("Return status y message error defaut", () => {
    const err = {};

    errorHandler(err, req, res, next);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({
      status: 500,
      message: MIDDLEWARE_MESSAGES.INTERNAL_ERROR_SERVE,
      data: null,
      path: "/test-route"
    });
  });
});

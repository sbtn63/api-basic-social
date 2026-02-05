const express = require("express");

const {AUTH_ROUTES} = require("./consts");

const router = express.Router();

router.get(AUTH_ROUTES.LOGIN, async (req, res, next) => {
  try {
    res.sendResponse(200, "Endpoint Login!!");
  } catch (error) {
    res.sendResponse(500, error.message);
  }
});

router.get(AUTH_ROUTES.REGISTER, async (req, res, next) => {
  try {
    res.sendResponse(200, "Endpoint Register");
  } catch (error) {
    res.sendResponse(500, error.message);
  }
});

module.exports = router;

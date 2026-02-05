const express = require("express");

const router = express.Router();

router.get("/login", async (req, res, next) => {
  try {
    res.sendResponse(200, "Endpoint Login!!");
  } catch (error) {
    res.sendResponse(500, error.message);
  }
});

router.get("/register", async (req, res, next) => {
  try {
    res.sendResponse(200, "Endpoint Register");
  } catch (error) {
    res.sendResponse(500, error.message);
  }
});

module.exports = router;

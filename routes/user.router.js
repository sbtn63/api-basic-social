const express = require("express");

const {USER_ROUTES} = require("./consts");
const isAuth = require("../middleware/isAuth.middleware");
const { getUserProfile } = require("../services/user.service");


const router = express.Router();

// Ruta para verificacion de middleware auth
router.get(
  USER_ROUTES.ME,
  isAuth,
  async (req, res, next) =>
{
  try {
    const id = req.auth.sub;
    const result = await getUserProfile(id);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

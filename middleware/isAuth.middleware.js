const isAuth = (req, res, next) => {
  if(!req.auth) {
    return res.sendResponse(401, "No autorizado, token faltante o invalido");
  }
  next();
};

module.exports = isAuth;

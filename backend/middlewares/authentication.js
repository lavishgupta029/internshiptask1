const HttpError = require("../http-error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    const error = new HttpError(
      "Authentication failed,as no token was found",
      401
    );
    return next(error);
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    } else {
      req.user = user;
      next();
    }
  });
}

module.exports = authenticate;

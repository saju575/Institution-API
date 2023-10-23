const createHttpError = require("http-errors");
const { JWT_ACCESS_KEY } = require("../secret");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

/* 
    authinticated user checking
*/
exports.isAuthenticated = async (req, res, next) => {
  try {
    const access_token = req.cookies.accessToken;
    // console.log(access_token);
    if (!access_token) {
      throw createHttpError(404, "Access token missing.Please login first");
    }

    const decode = jwt.verify(access_token, JWT_ACCESS_KEY);

    if (!decode) {
      throw createHttpError(401, "Access token is not valid");
    }

    const admin = await Admin.findById(decode.id);

    if (!admin) {
      throw createHttpError(404, "Admin not found");
    }

    req.admin = admin;

    next();
  } catch (error) {
    next(error);
  }
};

/* 
    authorization user role
*/

exports.authorizeRole =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!roles.includes(req.admin.role)) {
        throw createHttpError(403, `Role ${req.admin.role} is not allowed`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

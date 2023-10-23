const { createJWTToken } = require("../../helper/jwt.helper");
const Admin = require("../../models/admin.model");
const bcrypt = require("bcryptjs");
const { JWT_ACCESS_KEY } = require("../../secret");
const { successResponse } = require("../response/response.controller");
const createHttpError = require("http-errors");

/* 
    admin login handle
*/
exports.handleLogin = async (req, res, next) => {
  try {
    // email, password
    const { email, password } = req.validateBody;
    // isExist the email in DB
    const admin = await Admin.findOne({ email: email }).select("+password");

    if (!admin) {
      throw createHttpError(404, "Admin not found.Please register first.");
    }

    // compare the password

    const isPasswordsMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordsMatch) {
      throw createHttpError(401, "Email/password mismatch");
    }

    const data = { id: admin._doc._id };
    // token, cookie

    const accessToken = createJWTToken(data, JWT_ACCESS_KEY, "120 days");

    // set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 24 * 120 * 1000,
      httpOnly: true,
      // sameSite: "none",
      path: "/",
    });

    // successful response
    return successResponse(res, {
      statusCode: 200,
      message: "Admin were logged in successfully",
      payload: {
        admin: { ...admin._doc, password: undefined },
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

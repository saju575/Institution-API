const { createJWTToken } = require("../../helper/jwt.helper");
const Admin = require("../../models/admin.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_KEY,
  JWT_ACTIVATION_KEY,
  CLIENT_URL,
} = require("../../secret");
const { successResponse } = require("../response/response.controller");
const createHttpError = require("http-errors");
const Token = require("../../models/token.model");
const { sendEmailWithNodemailer } = require("../../helper/emailSend.helper");

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

/* 
  create a new admin controller
*/
exports.handleCreateNewAdmin = async (req, res, next) => {
  try {
    // email, password, name
    const { email, password, name } = req.validateBody;

    //check user admin already exist or not

    const adminExists = await Admin.exists({ email });
    if (adminExists) {
      throw createHttpError(
        409,
        "Admin with this email already exists. Please sign in."
      );
    }

    // create jwt token
    const jwtToken = createJWTToken(
      {
        name,
        email,
        password,
      },
      JWT_ACTIVATION_KEY,
      "5 days"
    );

    const token = await new Token({
      token: crypto.randomBytes(32).toString("hex"),
      jwtToken,
    }).save();

    // prepare email
    const emailData = {
      email,
      subject: `Account Activation Email`,
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to 
      <a href="${CLIENT_URL}/users/${token._id}/verify/${token.token}" target="_blank">activate your account</a>
      </p>
      `,
    };

    // send email with nodemail

    try {
      await sendEmailWithNodemailer(emailData);
    } catch (emailError) {
      try {
        await Token.findByIdAndDelete(token._id);
      } catch (error) {
        throw new Error(error);
      }
      next(createHttpError(500, "Failed to send varification email"));
      return;
    }

    // return success response

    return successResponse(res, {
      statusCode: 200,
      message: `An Email sent to your ${email} account please verify`,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  activateAdminAccount controller
*/
exports.activateAdminAccount = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      _id: req.params.id,
      token: req.params.token,
    });
    if (!token) {
      throw createHttpError(404, "Invalid Link");
    }

    const decodedInfo = jwt.verify(token.jwtToken, JWT_ACTIVATION_KEY);

    if (!decodedInfo) {
      throw createHttpError(404, "Invalid Link");
    }

    await Admin.create(decodedInfo);

    await Token.findByIdAndDelete(token._id);

    return successResponse(res, {
      statusCode: 201,
      message: `Email verified successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/* 
 Logout
*/

exports.handleLogout = async (req, res, next) => {
  try {
    //clear cookies
    res.clearCookie("accessToken");
    // successful response
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

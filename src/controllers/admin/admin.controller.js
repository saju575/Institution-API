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

    const data = { id: admin._doc._id, tokenVersion: admin._doc.tokenVersion };
    // token, cookie

    const accessToken = createJWTToken(data, JWT_ACCESS_KEY, "120 days");

    // set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 24 * 120 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
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
      <a href="${CLIENT_URL}/admin/${token._id}/verify/${token.token}" target="_blank">activate your account</a>
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

    const isEmailExist = await Admin.exists({ email: decodedInfo.email });

    if (isEmailExist) {
      throw createHttpError(404, "Invalid Link");
    }

    await Admin.create(decodedInfo);

    await Token.findByIdAndDelete(token._id);

    //clear cookies
    // res.clearCookie("accessToken", {
    //   path: "/",
    //   httpOnly: true,
    //   // secure: true,
    //   // sameSite: "None",
    // });

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
    res.clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    // successful response
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* admin profile */

exports.handleAdminProfile = async (req, res, next) => {
  try {
    const adminProfile = req.admin;

    if (!adminProfile) {
      throw createHttpError(404, "No profile available");
    }

    return successResponse(res, {
      payload: adminProfile,
    });
  } catch (error) {
    next(error);
  }
};

/* change password */
exports.handleChangePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (req.admin.email !== email) {
      throw createHttpError(401, "Invalid admin");
    }
    // Find admin by email
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      throw createHttpError(404, "Admin not found");
    }

    // Check if the provided old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid old password");
    }

    // Update the admin's password with the hashed new password
    admin.password = newPassword;

    // Increment the token version
    admin.tokenVersion += 1;
    // console.log(admin.tokenVersion);

    const data = {
      id: admin._doc._id,
      tokenVersion: admin.tokenVersion,
    };

    // token, cookie

    const accessToken = createJWTToken(data, JWT_ACCESS_KEY, "120 days");

    // set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 24 * 120 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    // Save the updated admin
    await admin.save();

    return successResponse(res, {
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* get all admin list */
exports.handleGetAllAdminList = async (req, res, next) => {
  try {
    const { page, limit, searchQuery, role } = req.query;

    let pageInt = parseInt(page) || 1;
    let limitInt = parseInt(limit) || 10;

    const skip = (pageInt - 1) * limitInt;

    const query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const admins = await Admin.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalDocuments = await Admin.countDocuments(query);

    return successResponse(res, {
      message: "Data returned successfully",
      payload: {
        admins,
        currentPage: pageInt,
        totalPages: Math.ceil(totalDocuments / limitInt),
        totalNews: totalDocuments,
        hasNext: pageInt < Math.ceil(totalDocuments / limitInt) ? true : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* delete admin */
exports.handleDeleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      throw createHttpError(404, "Admin not found");
    }

    await Admin.findByIdAndDelete(id);

    return successResponse(res, {
      message: "Successfully deleted news",
    });
  } catch (error) {
    next(error);
  }
};

/* forgot password */
exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    //check user admin already exist or not

    const adminExists = await Admin.findOne({ email });
    if (!adminExists) {
      throw createHttpError(409, "Admin with this email don't exists.");
    }

    // create jwt token
    const jwtToken = createJWTToken(
      {
        id: adminExists._id,
        email,
      },
      JWT_ACTIVATION_KEY,
      "10m"
    );

    const token = await new Token({
      token: crypto.randomBytes(32).toString("hex"),
      jwtToken,
    }).save();

    // prepare email
    const emailData = {
      email,
      subject: `Password reset Email`,
      html: `
      
      <p>Please click here to 
      <a href="${CLIENT_URL}/reset-password/${token._id}/verify/${token.token}" target="_blank">get password reset form</a>
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
      message: `An Email sent to your ${email} account to reset password`,
    });
  } catch (error) {
    next(error);
  }
};

/* verify forgot password token */

exports.handleVerifyTokenForgotPassword = async (req, res, next) => {
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

    const isEmailExist = await Admin.exists({
      email: decodedInfo.email,
      _id: decodedInfo.id,
    });

    if (!isEmailExist) {
      throw createHttpError(404, "Invalid Link");
    }

    return successResponse(res, {
      message: "Valid link",
    });
  } catch (error) {
    next(error);
  }
};

/* reset forgoten password */
exports.handleResetForgotenPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
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

    const existAdmin = await Admin.findOne({
      email: decodedInfo.email,
      _id: decodedInfo.id,
    });

    if (!existAdmin) {
      throw createHttpError(404, "Invalid Link");
    }

    existAdmin.password = password;

    await existAdmin.save();

    await Token.findByIdAndDelete(token._id);

    return successResponse(res, {
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

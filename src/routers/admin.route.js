const express = require("express");
const {
  handleLogin,
  handleCreateNewAdmin,
  activateAdminAccount,
  handleLogout,
  handleAdminProfile,
  handleChangePassword,
  handleGetAllAdminList,
  handleDeleteAdmin,
  handleForgotPassword,
  handleVerifyTokenForgotPassword,
  handleResetForgotenPassword,
} = require("../controllers/admin/admin.controller");
const {
  reqBodyValidator,
} = require("../validators/validationFun/administratorValidate.validationFun");
const {
  adminLoginValidationSchema,
  adminCreationSchema,
} = require("../validators/schema/admin.schema");
const {
  isAuthenticated,
  authorizeRole,
} = require("../middlewares/auth.middleware");

const adminRoute = express.Router();

/* 
    login
*/
adminRoute.post(
  "/login",
  reqBodyValidator(adminLoginValidationSchema),
  handleLogin
);

/* 
  process registration
*/
adminRoute.post(
  "/process-register",
  isAuthenticated,
  authorizeRole("superAdmin"),
  reqBodyValidator(adminCreationSchema),
  handleCreateNewAdmin
);

/* 
  active Admin account
*/
adminRoute.get("/:id/verify/:token", activateAdminAccount);

/* 
  logout Admin account
*/
adminRoute.post("/logout", isAuthenticated, handleLogout);

/* get user */
adminRoute.get("/admin-profile", isAuthenticated, handleAdminProfile);

/* change password */
adminRoute.put("/change-password", isAuthenticated, handleChangePassword);

/* get all admin */
adminRoute.get(
  "/all",
  isAuthenticated,
  authorizeRole("superAdmin"),
  handleGetAllAdminList
);

/* delete admin */
adminRoute.delete(
  "/delete-admin/:id",
  isAuthenticated,
  authorizeRole("superAdmin"),
  handleDeleteAdmin
);

/* forgot password */
adminRoute.post("/forgot-password", handleForgotPassword);

/* forgot password verify token */
adminRoute.get(
  "/reset-password/:id/verify/:token",
  handleVerifyTokenForgotPassword
);

/* reset forgoten  password  */
adminRoute.post(
  "/reset-password/:id/verify/:token",
  handleResetForgotenPassword
);
module.exports = adminRoute;

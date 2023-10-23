const express = require("express");
const {
  handleLogin,
  handleCreateNewAdmin,
  activateAdminAccount,
  handleLogout,
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

module.exports = adminRoute;

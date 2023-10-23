const express = require("express");
const { handleLogin } = require("../controllers/admin/admin.controller");
const {
  reqBodyValidator,
} = require("../validators/validationFun/administratorValidate.validationFun");
const {
  adminLoginValidationSchema,
} = require("../validators/schema/admin.schema");

const adminRoute = express.Router();

/* 
    login
*/
adminRoute.post(
  "/login",
  reqBodyValidator(adminLoginValidationSchema),
  handleLogin
);

module.exports = adminRoute;

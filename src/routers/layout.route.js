const express = require("express");
const {
  createLayout,
  editLayoutHandler,
  getLayoutByType,
  getSingleLayout,
} = require("../controllers/layout/layout.controller");
// const {
//   isAuthenticated,
//   authorizeRole,
// } = require("../middlewares/auth.middleware");

const layoutRoute = express.Router();

/* 
  layout create
*/
layoutRoute.post(
  "/create",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  createLayout
);

/* 
  layout edit
*/
layoutRoute.put(
  "/edit/:id",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  editLayoutHandler
);

/* 
    get layout data
*/
layoutRoute.get("/", getLayoutByType);

/* get Single layout with id */
layoutRoute.get("/:id", getSingleLayout);

module.exports = layoutRoute;

const express = require("express");
const {
  createNews,
  newsUpdateInfo,
  updateFile,
  deleteNews,
  getSingleNews,
  getAllNews,
  deleteFile,
} = require("../controllers/news/news.controller");
const { uploadMultiple } = require("../middlewares/multer.middleware");
const {
  reqBodyValidator,
  reqQueryValidator,
} = require("../validators/validationFun/administratorValidate.validationFun");
const {
  newsCreateValidation,
  newsUpdateValidation,
  newsQuerySchema,
} = require("../validators/schema/newsValidate.schema");
// const {
//   isAuthenticated,
//   authorizeRole,
// } = require("../middlewares/auth.middleware");

const newsRoute = express.Router();

/* 
    create news
*/
newsRoute.post(
  "/",
  uploadMultiple.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  reqBodyValidator(newsCreateValidation),
  createNews
);

/* 
  updateNews information
*/
newsRoute.put(
  "/update-info/:id",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  reqBodyValidator(newsUpdateValidation),
  newsUpdateInfo
);

/* 
  update image or pdf or both for news
*/
newsRoute.put(
  "/update-file/:id",
  uploadMultiple.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  updateFile
);

/* 
  delete news
*/
newsRoute.delete(
  "/delete/:id",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  deleteNews
);

/* Delete only image or pdf */
newsRoute.delete("/deleteFile/:id/:type", deleteFile);

/* 
  get single news
*/
newsRoute.get("/:id", getSingleNews);

/* 
  get all news
*/
newsRoute.get("/", reqQueryValidator(newsQuerySchema), getAllNews);

module.exports = newsRoute;

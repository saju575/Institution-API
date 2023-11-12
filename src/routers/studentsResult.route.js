const express = require("express");
const {
  creatResult,
  getAllResults,
  getSingleStudentResult,
} = require("../controllers/studentsResult/studentsResult.controller");
const { uploadXlxFile } = require("../middlewares/multer.middleware");
const {
  isAuthenticated,
  authorizeRole,
} = require("../middlewares/auth.middleware");

const resultRoute = express.Router();

resultRoute.post(
  "/result",
  uploadXlxFile.single("xlxFile"),
  isAuthenticated,
  authorizeRole("admin", "superAdmin"),
  creatResult
);

/* 
    get all results
*/
resultRoute.get("/all", getAllResults);

/* 
  get single student results
*/
resultRoute.get("/result", getSingleStudentResult);

module.exports = resultRoute;

const express = require("express");
const {
  creatResult,
  getAllResults,
  getSingleStudentResult,
  getSingleResult,
  deleteSingleResult,
  updateResult,
} = require("../controllers/studentsResult/studentsResult.controller");
const { uploadXlxFile } = require("../middlewares/multer.middleware");
// const {
//   isAuthenticated,
//   authorizeRole,
// } = require("../middlewares/auth.middleware");

const resultRoute = express.Router();

/* create */
resultRoute.post(
  "/result",
  uploadXlxFile.single("xlxFile"),
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  creatResult
);

/* 
delete result
*/
resultRoute.delete("/:id", deleteSingleResult);

/* Update result */
resultRoute.put("/:resultId", uploadXlxFile.single("xlxFile"), updateResult);

/* 
    get all results
*/
resultRoute.get("/all", getAllResults);

/* 
  get single student results
*/
resultRoute.post("/see-result", getSingleStudentResult);

/* 
  get single result
*/
resultRoute.get("/:id", getSingleResult);

module.exports = resultRoute;

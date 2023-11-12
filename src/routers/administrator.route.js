const express = require("express");
const {
  getAllAdministrators,
  getSingleAdministrator,
  deleteSingleAdministrator,
  createAdministrator,
  updateAdministratorInfo,
  updateAdministratorImage,
} = require("../controllers/administrators/administrator.controller");
const {
  reqBodyValidator,
  reqQueryValidator,
} = require("../validators/validationFun/administratorValidate.validationFun");
const {
  administratorQuerySchema,
  administratorCreateSchema,
  administratorUpdateSchema,
} = require("../validators/schema/administratorValidate.schema");
const {
  addDummyAdministator,
} = require("../seed/administator/createDummydata");
const { upload } = require("../middlewares/multer.middleware");
// const {
//   isAuthenticated,
//   authorizeRole,
// } = require("../middlewares/auth.middleware");

const administratorRoute = express.Router();

/* 
    get all administrator
*/
administratorRoute.get(
  "/all",
  reqQueryValidator(administratorQuerySchema),
  getAllAdministrators
);

/* 
  get single administrator
*/
administratorRoute.get("/:id", getSingleAdministrator);

/* 
  delete single administrator 
  requires admin or super admin to delete
  
*/
administratorRoute.delete(
  "/:id",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  deleteSingleAdministrator
);

/* 
  create administrator
  
*/
administratorRoute.post(
  "/",
  upload.single("image"),
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  reqBodyValidator(administratorCreateSchema),
  createAdministrator
);

/* 
update administrator information

*/
administratorRoute.put(
  "/update-info/:id",
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  reqBodyValidator(administratorUpdateSchema),
  updateAdministratorInfo
);

/* 
  update administrator image
*/
administratorRoute.patch(
  "/update-image/:id",
  upload.single("image"),
  // isAuthenticated,
  // authorizeRole("admin", "superAdmin"),
  updateAdministratorImage
);
/* 
  seed routes.It will be deleted when all api routes have been created. So Do not use it in production.
*/
administratorRoute.get("/seed", addDummyAdministator);

module.exports = administratorRoute;

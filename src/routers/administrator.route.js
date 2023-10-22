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
const upload = require("../middlewares/multer.middleware");

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
  TODO:add To a middleware that will check admin
*/
administratorRoute.delete("/:id", deleteSingleAdministrator);

/* 
  create administrator
  TODO:add To a middleware that will check admin
*/
administratorRoute.post(
  "/",
  upload.single("image"),
  reqBodyValidator(administratorCreateSchema),
  createAdministrator
);

/* 
update administrator information
TODO:add To a middleware that will check admin
*/
administratorRoute.put(
  "/update-info/:id",
  reqBodyValidator(administratorUpdateSchema),
  updateAdministratorInfo
);

/* 
  update administrator image
*/
administratorRoute.patch(
  "/update-image/:id",
  upload.single("image"),
  updateAdministratorImage
);
/* 
  seed routes.It will be deleted when all api routes have been created. So Do not use it in production.
*/
administratorRoute.get("/seed", addDummyAdministator);

module.exports = administratorRoute;

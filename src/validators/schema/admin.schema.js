const Joi = require("joi");

/* 
    admin login validation
*/
exports.adminLoginValidationSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required().min(6),
});

/* 
  admin creation validation schema
*/
exports.adminCreationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),

  password: Joi.string().required().min(6),
});

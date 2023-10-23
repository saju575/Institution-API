const Joi = require("joi");

/* 
    news creation validation
*/
exports.adminLoginValidationSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required().min(6),
});

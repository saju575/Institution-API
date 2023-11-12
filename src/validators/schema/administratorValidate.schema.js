const Joi = require("joi");

// Define a validation schema for the query parameters of administrator
exports.administratorQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  searchQuery: Joi.string(),
  role: Joi.string().valid("teacher", "others", "staff"),
  position: Joi.string(),
  gender: Joi.string().valid("male", "female", "other"),
});

// Define custom error messages
const errorMessages = {
  "string.base": "{#label} should be a string",
  "string.empty": "{#label} cannot be empty",
  "any.required": "{#label} is required",
  "string.valid": "{#label} is invalid",
};

// Define the Joi schema for administrator data
exports.administratorCreateSchema = Joi.object({
  name: Joi.string().required().messages(errorMessages),
  institution: Joi.string().required().messages(errorMessages),
  phone: Joi.string().optional(),
  role: Joi.string()
    .valid("teacher", "others", "staff")
    .required()
    .messages(errorMessages),
  position: Joi.string()

    .required()
    .messages(errorMessages),
  gender: Joi.string().valid("male", "female", "other").optional(),
  desc: Joi.string().allow(null).optional(),
});

exports.administratorUpdateSchema = Joi.object({
  name: Joi.string(),
  institution: Joi.string(),
  phone: Joi.string().allow(null),
  role: Joi.string().valid("teacher", "others", "staff"),
  position: Joi.string(),
  gender: Joi.string().valid("male", "female", "other"),
  desc: Joi.string().allow(null),
});
// or("name", "institution", "phone", "role", "position", "gender", "desc");
// const {}=this.administratorUpdateSchema.validateAsync()

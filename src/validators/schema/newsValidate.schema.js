const Joi = require("joi");

/* 
    news creation validation
*/
exports.newsCreateValidation = Joi.object({
  title: Joi.string().required(),
  type: Joi.string()
    .valid(
      "class routine",
      "exam routine",
      "syllabus",
      "admission circular",
      "admission syllabus",
      "admission notice",
      "admission result",
      "admission waiting result",
      "event",
      "general notice"
    )
    .required(),
  eventDate: Joi.date().optional(),
  desc: Joi.string().optional(),
  priority: Joi.string().valid("general", "urgent").default("general"),
});

/* 
news update validation
*/
exports.newsUpdateValidation = Joi.object({
  title: Joi.string().optional(),
  type: Joi.string()
    .valid(
      "class routine",
      "exam routine",
      "syllabus",
      "admission circular",
      "admission syllabus",
      "admission notice",
      "admission result",
      "admission waiting result",
      "event",
      "general notice"
    )
    .optional(),
  eventDate: Joi.date().optional(),
  desc: Joi.string().optional(),
  priority: Joi.string().valid("general", "urgent").optional(),
});

// Define a validation schema for the query parameters of news
exports.newsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  searchQuery: Joi.string(),
  type: Joi.string()
    .valid(
      "class routine",
      "exam routine",
      "syllabus",
      "admission circular",
      "admission syllabus",
      "admission notice",
      "admission result",
      "admission waiting result",
      "event",
      "general notice"
    )
    .optional(),
  priority: Joi.string().valid("general", "urgent").optional(),
});

const createHttpError = require("http-errors");

exports.reqQueryValidator = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query);

      if (error) {
        throw createHttpError(400, error.details[0].message);
      }

      req.validatedQuery = value; // Store the validated query in the request object for later use
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.reqBodyValidator = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);

      if (error) {
        const errorMessage = error.details[0].message.replace(/"/g, "");
        throw createHttpError(400, errorMessage);
      }

      req.validateBody = value; // Store the validated query in the request object for later use
      next();
    } catch (error) {
      next(error);
    }
  };
};

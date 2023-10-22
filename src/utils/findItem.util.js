const createHttpError = require("http-errors");
const mongoose = require("mongoose");

/* 
    find item with id
*/
exports.findWithId = async (Model, id, option = {}) => {
  try {
    //find item with id
    const item = await Model.findById(id, option);
    if (!item) {
      throw createHttpError(
        404,
        `${Model.modelName} does not exist with this id`
      );
    }

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(404, "Invalid Id");
    }
    throw error;
  }
};

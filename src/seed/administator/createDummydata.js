const Administrator = require("../../models/administrator.model");
const dummyAdministrators = require("./dummyData");

exports.addDummyAdministator = async (req, res, next) => {
  try {
    await Administrator.deleteMany({});
    const result = await Administrator.insertMany(dummyAdministrators);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

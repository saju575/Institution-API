const Datauri = require("datauri/parser");
const path = require("path");

const dUri = new Datauri();
/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = (file) => {
  const ext = path.extname(file.originalname.toLowerCase());
  return dUri.format(ext, file.buffer);
};

module.exports = dataUri;

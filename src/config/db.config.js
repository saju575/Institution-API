const mongoose = require("mongoose");
const { MONGODB_URL } = require("../secret");

/* 
    establish connection with mongoDB Database
*/

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(MONGODB_URL, options);
    console.info("Connected to MongoDB successfully");
    mongoose.connection.on("error", (err) => {
      throw new Error(err.message);
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;

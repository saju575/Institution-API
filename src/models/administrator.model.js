const mongoose = require("mongoose");

// Define the administrator schema
const administratorSchema = new mongoose.Schema(
  {
    image: {
      url: String,
      public_id: String,
      // default: null, // Optional field
    },
    name: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
      required: false,
    },
    role: {
      type: String,
      required: true,
      // enum: ["শিক্ষক", "কর্মকর্তা", "others"],
      enum: ["teacher", "staff", "others"],
    },
    position: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // You can expand this enum as needed
    },
    desc: {
      type: String,
      default: null, // Optional field
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the 'administrator' model
const Administrator = mongoose.model("Administrator", administratorSchema);

module.exports = Administrator;

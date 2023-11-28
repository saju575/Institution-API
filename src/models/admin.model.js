const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "Admin password is required"],
      minlength: [6, "Admin password length must be greater than 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin"],
      default: "admin",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;

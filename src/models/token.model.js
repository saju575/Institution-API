const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: { type: String, required: true },
  jwtToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: yourTimeInSeconds });
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 24 * 60 * 60 });

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;

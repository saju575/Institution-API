const { Schema, model } = require("mongoose");

const subject = new Schema({
  english: {
    type: Number,
  },
  bangla: {
    type: Number,
  },
  science: {
    type: Number,
  },
  chemistry: {
    type: Number,
  },
});

const result = new Schema({
  roll: {
    type: String,
  },
  name: {
    type: String,
  },
  gpa: {
    type: Number,
  },
  subjects: {
    type: [subject],
  },
});

/* 
    making user model schema
*/
const resultSchema = new Schema(
  {
    classTitle: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      //   required: true,
    },
    groups: {
      type: String,
    },
    year: {
      type: Number,
      required: true,
    },
    results: [result],
  },
  { timestamps: true, versionKey: false }
);

/* 
    make a model name "User"
*/
const Result = model("Result", resultSchema);

module.exports = Result;

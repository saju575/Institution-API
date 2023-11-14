const { Schema, model } = require("mongoose");

const subject = new Schema({
  English: {
    type: Number,
  },
  Bangla: {
    type: Number,
  },
  "Bangla 1st Paper": {
    type: Number,
  },
  "Bangla 2nd Paper": {
    type: Number,
  },
  "English 1st Paper": {
    type: Number,
  },
  "English 2nd Paper": {
    type: Number,
  },
  Math: {
    type: Number,
  },
  Religion: {
    type: Number,
  },
  ICT: {
    type: Number,
  },
  Physics: {
    type: Number,
  },
  Biology: {
    type: Number,
  },
  "Higher Math": {
    type: Number,
  },
  Accounting: {
    type: Number,
  },
  Finance: {
    type: Number,
  },
  "Business Entrepreneurship": {
    type: Number,
  },
  "Agricultural Studies": {
    type: Number,
  },
  "General Science": {
    type: Number,
  },
  "Bangladesh and Global Studies": {
    type: Number,
  },
  Science: {
    type: Number,
  },
  Chemistry: {
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
  GPA: {
    type: Number,
  },

  subjects: {
    type: subject,
  },
});

/* 
    making user model schema
*/
const resultSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    classTitle: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
      default: "None",
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

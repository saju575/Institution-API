const { Schema, model } = require("mongoose");

const subject = new Schema({
  "Quran Majid": {
    type: Number,
  },
  "Hadith Sharif": {
    type: Number,
  },
  "Hadith & Usulul Hadith": {
    type: Number,
  },
  "Aqaid Fique": {
    type: Number,
  },
  "Fique 1st Paper": {
    type: Number,
  },
  "Fique 2nd Paper": {
    type: Number,
  },
  Arabic: {
    type: Number,
  },
  "Arabic 1st Paper": {
    type: Number,
  },
  "Arabic 2nd Paper": {
    type: Number,
  },
  "Islamic History": {
    type: Number,
  },
  "Balagat & Mantiq": {
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
  English: {
    type: Number,
  },
  "English 1st Paper": {
    type: Number,
  },
  "English 2nd Paper": {
    type: Number,
  },
  "English Grammar and Composition": {
    type: Number,
  },
  Science: {
    type: Number,
  },
  ICT: {
    type: Number,
  },
  Math: {
    type: Number,
  },
  "General Math": {
    type: Number,
  },
  "Higher Math": {
    type: Number,
  },
  Chemistry: {
    type: Number,
  },
  "Chemistry 1st Paper": {
    type: Number,
  },
  "Chemistry 2nd Paper": {
    type: Number,
  },
  Biology: {
    type: Number,
  },
  "Biology 1st Paper": {
    type: Number,
  },
  "Biology 2nd Paper": {
    type: Number,
  },
  Physics: {
    type: Number,
  },
  "Physics 1st Paper": {
    type: Number,
  },
  "Physics 2nd Paper": {
    type: Number,
  },
  Economics: {
    type: Number,
  },
  "Economics 1st Paper": {
    type: Number,
  },
  "Economics 2nd Paper": {
    type: Number,
  },
  "History of Bangladesh and World Civilization": {
    type: Number,
  },
  "Geography and Environment": {
    type: Number,
  },
  "Agriculture Studies": {
    type: Number,
  },
  "Finance And Banking": {
    type: Number,
  },
  "Islam and Moral Education": {
    type: Number,
  },
  "Hindu Religion and Moral Education": {
    type: Number,
  },
  "Buddhist Religion and Moral Education": {
    type: Number,
  },
  "Bangladesh and Global Studies": {
    type: Number,
  },
  "Physical Education, Health Science and Sports": {
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

const { Schema, model } = require("mongoose");

const subject = new Schema({
  "QURAN MAJID": {
    type: Number,
  },
  "HADITH SHARIF": {
    type: Number,
  },
  "HADITH AND USULUL HADITH": {
    type: Number,
  },
  "AQID FIQH": {
    type: Number,
  },
  "FIQH 1ST PAPER": {
    type: Number,
  },
  "FIQH 2ND PAPER": {
    type: Number,
  },
  ARABIC: {
    type: Number,
  },
  "ARABIC 1ST PAPER": {
    type: Number,
  },
  "ARABIC 2ND PAPER": {
    type: Number,
  },
  "ISLAMIC HISTORY": {
    type: Number,
  },
  "BALAGAT AND MANTIQ": {
    type: Number,
  },
  BANGLA: {
    type: Number,
  },
  "BANGLA 1ST PAPER": {
    type: Number,
  },
  "BANGLA 2ND PAPER": {
    type: Number,
  },
  ENGLISH: {
    type: Number,
  },
  "ENGLISH 1ST PAPER": {
    type: Number,
  },
  "ENGLISH 2ND PAPER": {
    type: Number,
  },
  "ENGLISH GRAMMAR AND COMPOSITION": {
    type: Number,
  },
  SCIENCE: {
    type: Number,
  },
  ICT: {
    type: Number,
  },
  MATH: {
    type: Number,
  },
  "GENERAL MATH": {
    type: Number,
  },
  "HIGHER MATH": {
    type: Number,
  },
  CHEMISTRY: {
    type: Number,
  },
  "CHEMISTRY 1ST PAPER": {
    type: Number,
  },
  "CHEMISTRY 2ND PAPER": {
    type: Number,
  },
  BIOLOGY: {
    type: Number,
  },
  "BIOLOGY 1ST PAPER": {
    type: Number,
  },
  "BIOLOGY 2ND PAPER": {
    type: Number,
  },
  PHYSICS: {
    type: Number,
  },
  "PHYSICS 1ST PAPER": {
    type: Number,
  },
  "PHYSICS 2ND PAPER": {
    type: Number,
  },
  ECONOMICS: {
    type: Number,
  },
  "ECONOMICS 1ST PAPER": {
    type: Number,
  },
  "ECONOMICS 2ND PAPER": {
    type: Number,
  },
  "HISTORY OF BANGLADESH AND WORLD CIVILIZATION": {
    type: Number,
  },
  "GEOGRAPHY AND ENVIRONMENT": {
    type: Number,
  },
  "AGRICULTURE STUDIES": {
    type: Number,
  },
  "FINANCE AND BANKING": {
    type: Number,
  },
  "ISLAM AND MORAL EDUCATION": {
    type: Number,
  },
  "HINDU RELIGION AND MORAL EDUCATION": {
    type: Number,
  },
  "BUDDHIST RELIGION AND MORAL EDUCATION": {
    type: Number,
  },
  "BANGLADESH AND GLOBAL STUDIES": {
    type: Number,
  },
  "PHYSICAL EDUCATION, HEALTH SCIENCE AND SPORTS": {
    type: Number,
  },
});

const result = new Schema({
  ROLL: {
    type: String,
  },
  NAME: {
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

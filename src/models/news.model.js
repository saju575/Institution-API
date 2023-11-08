const mongoose = require("mongoose");

const priorityEnum = ["general", "urgent"];
const typeEnum = [
  "class routine",
  "exam routine",
  "syllabus",
  "admission circular",
  "admission syllabus",
  "admission notice",
  "admission result",
  "admission waiting result",
  "event",
  "general notice",
];

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: typeEnum,
      required: true,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    eventDate: {
      type: Date,
    },
    pdf: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    desc: {
      type: String,
    },
    priority: {
      type: String,
      enum: priorityEnum,
      default: "general",
    },
  },
  { timestamps: true, versionKey: false }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;

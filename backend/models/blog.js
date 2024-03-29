const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {}, // multiple datatypes
      required: true,
      min: 200,
      max: 2000000
    },
    excerpt: {
      type: String,
      max: 1000
    },
    metaTitle: {
      type: String
    },
    metaDesc: {
      type: String
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    postedBy: {
      type: ObjectId,
      ref: "User"
    },
    categories: [{ type: ObjectId, ref: "Category", required: true }], // references Category model
    tags: [{ type: ObjectId, ref: "Tag", required: true }] // references Tag model
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

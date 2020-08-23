const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: true,
      max: 500
    },
    slug: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model("Comment", commentSchema);

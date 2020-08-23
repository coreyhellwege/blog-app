const { check } = require("express-validator");

exports.commentCreateValidator = [
  check("comment")
    .not()
    .isEmpty()
    .withMessage("Comment is required")
];

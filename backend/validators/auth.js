const { check } = require("express-validator");

exports.userSignUpValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required"),
  check("email")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
  // check("password")
  //   .isAlphanumeric("en-AU")
  //   .withMessage("Password must be alphanumeric")
];

exports.userSignInValidator = [
  check("email")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address")
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

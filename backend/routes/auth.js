const express = require("express");
const router = express.Router();

// controller methods
const {
  preSignup,
  signup,
  signin,
  signout,
  requireSignin,
  forgotPassword,
  resetPassword,
  googleLogin
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const {
  userSignUpValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require("../validators/auth");

// handle incoming routes & run validators on the requests
router.post("/pre-signup", userSignUpValidator, runValidation, preSignup);
router.post("/signup", signup);
router.post("/signin", userSignInValidator, runValidation, signin);
router.get("/signout", signout);
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

// google login
router.post("/google-login", googleLogin);

// export routes
module.exports = router;

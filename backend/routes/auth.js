const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const {
  userSignUpValidator,
  userSignInValidator
} = require("../validators/auth");

// handle incoming routes & run validators on the requests
router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/signin", userSignInValidator, runValidation, signin);
router.get("/signout", signout);

// test
// router.get("/secret", requireSignin, (req, res) => {
//   res.json({
//     user: req.user
//   });
// });

// export routes
module.exports = router;

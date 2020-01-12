const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const { userSignUpValidator } = require("../validators/auth");

// handle incoming routes & run validators on the requests
router.post("/signup", userSignUpValidator, runValidation, signup);

// export routes
module.exports = router;

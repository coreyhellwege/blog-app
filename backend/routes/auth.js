const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/auth");

// handle incoming routes
router.post("/signup", signup);

// export routes
module.exports = router;

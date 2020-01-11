const express = require("express");
const router = express.Router();
const { time } = require("../controllers/blog");

// handle incoming routes
router.get("/", time);

// export routes
module.exports = router;

const express = require("express");
const router = express.Router();
const { create } = require("../controllers/blog");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../controllers/auth");

// handle incoming routes
router.post("/blog", requireSignin, adminMiddleware, create);

// export routes
module.exports = router;

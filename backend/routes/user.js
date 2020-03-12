const express = require("express");
const router = express.Router();
const { read, publicProfile } = require("../controllers/user");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../controllers/auth");

router.get("/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile); // public profile

module.exports = router;

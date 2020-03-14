const express = require("express");
const router = express.Router();
const { read, publicProfile, update, photo } = require("../controllers/user");
const {
  requireSignin,
  authMiddleware, // makes user available in the request object as 'user'
  adminMiddleware
} = require("../controllers/auth");

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile); // public profile
router.put("/user/update", requireSignin, authMiddleware, update);
router.get("/user/photo/:username", photo); // get profile photo

module.exports = router;

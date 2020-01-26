const express = require("express");
const router = express.Router();
const { read } = require("../controllers/user");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../controllers/auth");

router.get("/profile", requireSignin, authMiddleware, read);

module.exports = router;

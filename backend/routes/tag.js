const express = require("express");
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/tag");

// validators
const { runValidation } = require("../validators");
const { createTagValidator } = require("../validators/tag");

router.post(
  "/tag",
  createTagValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

// get all tags
router.get("/tags", list);

// get single tag
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;

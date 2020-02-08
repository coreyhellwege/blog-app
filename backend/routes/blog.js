const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
  listAllBlogsCategoriesTags,
  photo
} = require("../controllers/blog");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../controllers/auth");

// handle incoming routes
router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, authMiddleware, remove);
router.put("/blog/:slug", requireSignin, authMiddleware, update);
router.get("/blog/photo/:slug", photo);

// export routes
module.exports = router;

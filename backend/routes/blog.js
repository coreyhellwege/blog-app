const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
  listAllBlogsCategoriesTags,
  photo,
  listRelated,
  listSearch
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
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);

// export routes
module.exports = router;

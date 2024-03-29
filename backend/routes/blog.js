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
  listSearch,
  listByUser
} = require("../controllers/blog");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteBlog
} = require("../controllers/auth");

// handle incoming routes
router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/blogs", list);
router.get("/blog/:slug", read);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put("/blog/:slug", requireSignin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);

// auth user (non admin) crud
router.get("/:username/blogs", listByUser);
router.post("/user/blog", requireSignin, authMiddleware, create);
router.delete(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  remove
);
router.put(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  update
);

// export routes
module.exports = router;

const User = require("../models/user");
const Blog = require("../models/blog");
const { errorHandler } = require("../helpers/dbErrorHandler");

// give the user info
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
  let username = req.params.username;
  let blogs;

  User.findOne({ username }).exec((err, userFromDB) => {
    if (err || !userFromDB) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    let user = userFromDB;
    let userId = user._id;

    // query blogs based on the user id
    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name slug")
      .limit(10) // only get last 10 blogs
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      ) // get out what we need
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        // dont send these:
        user.photo = undefined;
        user.hashed_password = undefined;
        res.json({
          user,
          blogs: data
        });
      });
  });
};

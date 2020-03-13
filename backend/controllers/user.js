const User = require("../models/user");
const Blog = require("../models/blog");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs"); // file system
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

// update user method
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  // parse form data
  form.parse(req, (err, fields, files) => {
    // handle errors
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }

    // save user
    // note: profile is available in the request because we used authMiddleware
    let user = req.profile;
    // use lodash extend method to update fields that have changed
    user = _.extend(user, fields);

    // handle files
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image size should be less than 1mb"
        });
      }
    }

    // save photo
    user.photo.data = fs.readFileSync(files.photo.path);
    user.photo.contentType = files.photo.type;

    // save updated user
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          // error will come from db
          error: errorHandler(err)
        });
      }
      // dont return password hash
      user.hashed_password = undefined;
      res.json(user);
    });
  });
};

// get user photo method
exports.photo = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    // return users photo
    if (user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    }
  });
};

const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");

exports.create = (req, res) => {
  // handle form
  let form = new formidable.IncomingForm(); // get form data
  form.keepExtensions = true; // keep files' default extensions
  // parse form data into a js object
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    // get fields from form data
    const { title, body, categories, tags } = fields;

    // custom validators
    if (!title || !title.length) {
      return res.status(400).json({
        error: "Title is required"
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: "Content is too short"
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "At least one category is required"
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: "At least one tag is required"
      });
    }

    // create a blog with the following properties
    let blog = new Blog();
    blog.title = title; // aka fields.title
    blog.body = body;
    blog.slug = slugify(title).toLowerCase();
    blog.metaTitle = `${title} | ${process.env.APP_NAME}`;
    blog.metaDesc = stripHtml(body.substring(0, 160)); // first 160 chars
    blog.postedBy = req.user._id; // logged in user

    // comma separated array of categories and tags
    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");

    // handle files
    if (files.photo) {
      if (files.photo.size > 10000000) {
        // 1mb
        return res.status(400).json({
          error: "Image size must be less than 1mb"
        });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    // save blog to db
    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err) // error will come from Mongoose
        });
      }
      // push categories into blog
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true } // return updated data to frontend
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        } else {
          // push tags into blog
          Blog.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err)
              });
            } else {
              res.json(result);
            }
          });
        }
      });
    });
  });
};

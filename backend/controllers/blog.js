const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs"); // file system
const { smartTrim } = require("../helpers/blog");

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
    blog.excerpt = smartTrim(body, 320, " ", "...");
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

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    // .select("-photo")
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      res.json(data); // return the blogs
    });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    let form = new formidable.IncomingForm(); // get form data
    form.keepExtensions = true; // keep files' default extensions

    // parse form data into a js object
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded"
        });
      }

      let slugBeforeMerge = oldBlog.slug; // slug doesn't change (because it's indexed by Google after being created)
      oldBlog = _.merge(oldBlog, fields); // merge in only data that has changed
      oldBlog.slug = slugBeforeMerge;

      const { body, desc, categories, tags } = fields;

      // if body has changed also update excerpt
      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, "", " ...");
        // update meta desc
        oldBlog.desc = stripHtml(body.substring(0, 160));
      }

      if (categories) {
        oldBlog.categories = categories.split(","); // to generate array
      }

      if (tags) {
        oldBlog.tags = tags.split(",");
      }

      // update photo
      if (files.photo) {
        if (files.photo.size > 10000000) {
          // 1mb
          return res.status(400).json({
            error: "Image size must be less than 1mb"
          });
        }
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      }

      // save blog to db
      oldBlog.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err) // error will come from Mongoose
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err)
      });
    }
    res.json({
      // must return message as a string so it works in the frontend
      message: "Blog successfully deleted"
    });
  });
};

exports.list = (req, res) => {
  Blog.find({}) // get all blogs
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    ) // don't return image (too slow)
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      res.json(data); // return the blogs
    });
};

exports.listAllBlogsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10; // how many per request
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;
  let tags;

  Blog.find({}) // get all blogs
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 }) // latest blogs returned first
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      blogs = data;

      // get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err)
          });
        }
        categories = c;

        // get all tags
        Tag.find({}).exec((err, t) => {
          if (err) {
            return res.json({
              error: errorHandler(err)
            });
          }
          tags = t;

          // return all blogs, categories and tags
          res.json({ blogs, categories, tags, size: blogs.length });
        });
      });
    });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    });
};

exports.listRelated = (req, res) => {
  // console.log(req.body.blog);
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;

  // grab id and categories from blog in the request
  const { _id, categories } = req.body.blog;

  // find blogs by this blog's categories, but don't include itself
  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Blogs not found"
        });
      }
      res.json(blogs);
    });
};

exports.listSearch = (req, res) => {
  console.log(req.query);
  // send request query by name of 'search'
  const { search } = req.query;
  // find blogs based on the search
  if (search) {
    // search title and body
    Blog.find(
      {
        // using regex with the mongoose $or method
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } }
        ]
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        // don't need to send the entire blog object, only the title is necessary
        res.json(blogs);
      }
      // de-select photo and body
    ).select("-photo -body");
  }
};

// return all blogs based on username
exports.listByUser = (req, res) => {
  // find user by username
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    let userId = user._id;
    // find blogs based on the user id
    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select("_id title slug postedBy createdAt updatedAt")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        res.json(data);
      });
  });
};

const User = require("../models/user");
const Blog = require("../models/blog");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  // check if username alraedy exists
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken"
      });
    }

    // if user doesn't exist yet, create new user
    const { name, email, password } = req.body;
    let username = shortId.generate(); // generate random username
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({ name, email, password, profile, username });

    newUser.save((error, success) => {
      if (error) {
        return res.status(400).json({
          error: "Could not sign up user"
        });
      }
      res.json({
        message: "Signup successful! Sign in"
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  User.findOne({ email }).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "Email does not exist. Sign up."
      });
    }

    // authenticate plain password from client
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match."
      });
    }

    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // save the token in browser cookies
    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Successfully signed out"
  });
};

// middleware to create protected routes
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  // get user by id
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    // return the user
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  // get user by id
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    // check user role
    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource only. Access denied."
      });
    }
    // return the user
    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    let authorisedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorisedUser) {
      return res.status(400).json({
        error: "Not authorised"
      });
    }
    next();
  });
};

exports.forgotPassword = (req, res) => {
  // get the user's email
  const { email } = req.body;
  // check if user exists
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User does not exist"
      });
    }
    // generate a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m"
    });
    // email the token to the user
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Reset password link - ${process.env.APP_NAME}`,
      html: `
          <p>Please click on the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>https://climatefacts.com</p>
      `
    };
    // save user's resetPasswordLink to db
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        // send the email
        sgMail.send(emailData).then(sent => {
          return res.json({
            message: `Reset password link has been sent to ${email}`
          });
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  // grab reset password link and new password
  const { resetPasswordLink, newPassword } = req.body;

  // find user based on the reset password link
  if (resetPasswordLink) {
    // make sure the token hasnt expired
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Link expired. Please try again."
        });
      } else {
        // find the user
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(401).json({
              error: "Something went wrong. Please try again later."
            });
          }
          // update user's password to the new password and reset the password link
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
          };
          // use lodash extend method to update user
          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err || !user) {
              return res.status(401).json({
                // give the error to errorHandler because it's coming fromt the db
                error: errorHandler(err)
              });
            }
            // success
            res.json({
              message: "Password successfully reset. Please log in."
            });
          });
        });
      }
    });
  }
};

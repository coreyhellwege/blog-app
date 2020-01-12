const User = require("../models/user");
const shortId = require("shortid");

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
          error: error
        });
      }
      res.json({
        message: "Signup successful! Sign in"
      });
    });
  });
};

// render the errors
const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  // get the errors from the request
  const errors = validationResult(req);

  // if there are errors, give the first one
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  // continue running
  next();
};

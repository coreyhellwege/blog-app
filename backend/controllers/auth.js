exports.signup = (req, res) => {
  // get data from the body of the request
  const { name, email, password } = req.body;
  res.json({
    user: { name, email, password }
  });
};

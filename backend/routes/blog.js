const express = require("express");
const router = express.Router();

// handle incoming routes
router.get("/", (req, res) => {
  res.json({ time: Date().toString() });
});

// export routes
module.exports = router;

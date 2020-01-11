const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// app
const app = express();

// database
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database connected");
  });

// middleware
app.use(morgan("dev")); // gives us access to endpoints in the console
app.use(bodyParser.json());
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// routes
app.get("/api", (req, res) => {
  res.json({ time: Date().toString() });
});

// port
const port = process.env.PORT || 8000; // use the port in our env file or default 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

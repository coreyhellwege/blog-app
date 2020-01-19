const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      required: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    about: {
      type: String
    },
    role: {
      type: Number,
      trim: true,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ""
    }
  },
  { timestamp: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    // create a temporary var to store pass
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// create the methods
userSchema.methods = {
  // compare encrypted pass with hashed pass in the db
  authenticate: function(plainText) {
    // hash the plain text pass
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  // hash the password
  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  // generate salt
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random() + "");
  }
};

// export the model and name it 'User'
module.exports = mongoose.model("User", userSchema);

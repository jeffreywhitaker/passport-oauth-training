const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    username: String,
    googleId: String,
    thumbnail: String,

    id: String,
    token: String,
    email: String
  }
});

// generate a hash
userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = password => {
  return bcrypt.compareSync(password, this.local.password);
};

//export
const User = mongoose.model("User", userSchema);
module.exports = User;

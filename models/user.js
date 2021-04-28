const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferedCategories: [{ type: String, trim: true }],
  preferedSources: [{ type: String, trim: true }],
  resetToken: { type: String, trim: true },
  resetTokenExpiration: { type: Date },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.__v;
  delete userObject.password;
  delete userObject._id;

  return userObject;
};

userSchema.methods.generateToken = async function () {
  const tokenSecret = process.env.TOKEN_SECRET;
  const token = jwt.sign({ id: this._id }, tokenSecret, {
    expiresIn: "1h",
  });

  return token;
};

userSchema.statics.findByLogin = async (username, password) => {
  const user = await User.findOne({ username });
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw new Error("Wrong password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

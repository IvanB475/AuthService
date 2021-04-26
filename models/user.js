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
  preferences: [
    {
      _id: false,
      idSource: { type: String },
      category: [
        {
          _id: false,
          name: { type: String },
          href: { type: String },
          path: { type: String },
        },
      ],
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.preferences;
  delete userObject.__v;
  delete userObject.password;

  return userObject;
};

userSchema.methods.generateToken = async function () {
  const tokenSecret = process.env.TOKEN_SECRET;
  console.log(tokenSecret);
  const token = jwt.sign({ id: this._id }, tokenSecret, {
    expiresIn: "1h",
  });
  console.log(token);

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

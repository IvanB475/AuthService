const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const securePW = await bcrypt.hash(password, 12);

    const user = new User({
      username: username.toLowerCase(),
      email,
      password: securePW,
    });

    const savedUser = await user.save();
    const token = savedUser.generateToken();
    res.setHeader("Authorization", token);
    res.status(201).json({ message: "You have been registered" });
  } catch (e) {
    res.status(400).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByLogin(username.toLowerCase(), password);
    const token = user.generateToken();
    res.setHeader("Authorization", token);
    res.status(200).json({ message: "you've been logged in" });
  } catch (e) {
    res.status(400).json({ message: "invalid username or password" });
  }
};

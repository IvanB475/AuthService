const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validateToken } = require("../utils/validateToken");
const { generateForgotPwToken } = require("../utils/generateRandomToken");
const { sendMail, sendMailViaApi } = require("../utils/sendMail");

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
    const token = await savedUser.generateToken();
    console.log(token);
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
    const token = await user.generateToken();
    res.setHeader("Authorization", token);
    res.status(200).json({ message: "you've been logged in" });
  } catch (e) {
    res.status(400).json({ message: "invalid username or password" });
  }
};

exports.getSettings = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const result = await validateToken(token);
    const userId = result.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (e) {
    res.status(400).json({ message: "something went wrong" });
  }
};

exports.changePassword = async (req, res, next) => {
  const token = req.header("Authorization");
  const { newPassword, confirmPassword } = req.body;
  try {
    const result = await validateToken(token);
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "passwords do not match" });
    } else {
      const userId = result.id;
      const newUserPassword = await bcrypt.hash(newPassword, 12);
      await User.findByIdAndUpdate(userId, { password: newUserPassword });
      res.status(201).json({ message: "password changed successfully" });
    }
  } catch (e) {
    res.status(400).json({ message: "password couldn't be changed" });
  }
};

exports.updateSettings = async (req, res, next) => {
  const token = req.header("Authorization");
  const email = req.body?.email;
  const preferedCategories = req.body?.preferedCategories;
  const preferedSources = req.body?.preferedSources;

  try {
    const result = await validateToken(token);
    const userId = result.id;
    const user = await User.findById(userId);
    user.email = email || user.email;
    if (preferedCategories) user.preferedCategories.push(preferedCategories);
    if (preferedSources) user.preferedSources.push(preferedSources);
    await user.save();
    res.status(201).json({ message: "updated profile successfully" });
  } catch (e) {
    res.status(400).json({ message: "something went wrong" });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body?.email;
  if (!email) {
    res.status(400).json({ message: "input your email" });
  } else {
    try {
      const token = await generateForgotPwToken(10);
      console.log(token);
      const user = await User.findOne({ email });
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save();
      const title = "Request password confirmation";
      const content =
        "You're receiving this email because you(or someone else) have requested the reset of the password for your account.\n\n Your reset token is " +
        token +
        ".\n\n If you did not request this, please ignore this email.";
      const mail = await sendMail(user.email, title, content);
      console.log(mail);
      res.status(200).json({
        message: "mail was sent to your email, please check your inbox",
      });
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
    }
  }
};

exports.forgotPasswordOnAws = async (req, res, next) => {
  const email = req.body?.email;
  const secret = process.env.API_SECRET;
  if (!email) {
    res.status(400).json({ message: "input your email" });
  } else {
    try {
      const token = await generateForgotPwToken(10);
      console.log(token);
      const user = await User.findOne({ email });
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save();
      const mail = await sendMailViaApi(email, token, secret);
      res.status(200).json({ message: "OK" });
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
    }
  }
};

exports.validateResetToken = async (req, res, next) => {
  const token = req.body?.token;
  if (!token) {
    res.status(400).json({ message: "input token" });
  }
  try {
    const user = await User.findOne({ resetToken: token });
    if (Date.now() < user.resetTokenExpiration) {
      const authToken = await user.generateToken();
      res.setHeader("Authorization", authToken);
      res.status(200).json({ message: "OK" });
    }
  } catch (e) {
    res.status(400).json({ message: "something went wrong" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const result = await validateToken(token);
    const userId = result.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "account was deleted" });
  } catch (e) {
    res.status(400).json({ message: "something went wrong" });
  }
};

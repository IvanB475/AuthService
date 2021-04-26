const jwt = require("jsonwebtoken");

exports.validateToken = async (token) => {
  try {
    const tokenSecret = process.env.TOKEN_SECRET;
    const validationResult = jwt.verify(token, tokenSecret);
    return true;
  } catch (e) {
    return false;
  }
};
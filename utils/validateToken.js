const jwt = require("jsonwebtoken");

exports.validateToken = async (token) => {
  try {
    const tokenSecret = process.env.TOKEN_SECRET;
    const token = jwt.verify(token, tokenSecret);

    return true;
  } catch (e) {
    return false;
  }
};

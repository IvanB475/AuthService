const jwt = require("jsonwebtoken");

exports.validateToken = async (token) => {
  try {
    const tokenSecret = process.env.TOKEN_SECRET;
    const validationResult = jwt.verify(token, tokenSecret);
    return validationResult;
  } catch (e) {
    throw new Error(e);
  }
};

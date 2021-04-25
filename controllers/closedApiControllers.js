const validateTokenFunc = require("../utils/validateToken");

exports.validateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log("token from header is" + token);
  const validated = validateTokenFunc.validateToken(token);
  if (validated) {
    next();
  } else {
    res.status(403).json({ message: "You are not authorized to use this API" });
  }
};

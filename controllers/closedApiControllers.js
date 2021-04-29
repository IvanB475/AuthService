const { validateToken } = require("../utils/validateToken");

exports.validateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  const validated = await validateToken(token);
  if (validated) {
    res.status(200).json({ valid: "OK" });
  } else {
    res.status(403).json({ message: "You are not authorized to use this API" });
  }
};

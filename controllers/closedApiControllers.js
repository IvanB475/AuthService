const validateTokenFunc = require("../utils/validateToken");

exports.validateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  const validated = await validateTokenFunc.validateToken(token);
  if (validated) {
    console.log("validated" + validated);
    res.status(200).json({ valid: "OK" });
  } else {
    res.status(403).json({ message: "You are not authorized to use this API" });
  }
};

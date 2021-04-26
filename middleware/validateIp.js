exports.validateUserIp = (req, res, next) => {
  const remoteIp = req.connection.remoteAddress.split(`:`).pop();
  const localIp = req.connection.localAddress.split(`:`).pop();
  console.log("remote ip is " + remoteIp + " AND local ip is " + localIp);
  if (remoteIp === localIp) {
    console.log("access verified");
    next();
  } else {
    res.status(403).json({ message: "Access forbidden" });
  }
};

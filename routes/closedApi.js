const closedApiControllers = require("../controllers/closedApiControllers");
const validateIp = require("../middleware/validateIp");
const express = require("express");
const router = express.Router();

router.get(
  "/validateToken",
  validateIp.validateUserIp,
  closedApiControllers.validateToken
);

module.exports = router;

const closedApiControllers = require("../controllers/closedApiControllers");
const express = require("express");
const router = express.Router();

router.get("/validateToken", closedApiControllers.validateToken);

module.exports = router;

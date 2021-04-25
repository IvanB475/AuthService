const express = require("express");
const router = express.Router();
const openApiControllers = require("../controllers/openApiControllers");

router
  .post("/signUp", openApiControllers.signUp)
  .post("/login", openApiControllers.login);

module.exports = router;

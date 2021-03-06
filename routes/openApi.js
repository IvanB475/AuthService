const express = require("express");
const router = express.Router();
const openApiControllers = require("../controllers/openApiControllers");

router.get("/settings", openApiControllers.getSettings);

router
  .post("/signUp", openApiControllers.signUp)
  .post("/forgotPassword", openApiControllers.forgotPasswordOnAws)
  .post("/validateResetToken", openApiControllers.validateResetToken)
  .post("/login", openApiControllers.login);

router
  .put("/changePassword", openApiControllers.changePassword)
  .put("/updateSettings", openApiControllers.updateSettings);

router.delete("/deleteUser", openApiControllers.deleteUser);

module.exports = router;

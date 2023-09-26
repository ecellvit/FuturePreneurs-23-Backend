const express = require("express");
const authController = require("../controllers/auth/userauth");
const authRouter = express.Router();

authRouter.route("/googleAuth").post(authController.googleAuth);
authRouter.route("/logout").delete(authController.logout);

module.exports = authRouter;

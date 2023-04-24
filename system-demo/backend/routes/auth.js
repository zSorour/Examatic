const { Router } = require("express");

const authController = require("../controllers/auth");
const authValidator = require("../validators/auth");

const authRouter = Router();

authRouter.post(
  "/login",
  authValidator.signInValidator(),
  authController.login
);

//This route is for simulation purposes only!
//Typically, there would not be a register feature since user data is retrieved from educational institutions' API.
authRouter.post(
  "/register",
  authValidator.registerValidator(),
  authController.register
);

module.exports = authRouter;

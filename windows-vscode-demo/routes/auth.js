const { Router } = require("express");

const authController = require("../controllers/authController");
const authValidator = require("../validators/auth");

const authRouter = Router();

authRouter.post(
  "/login",
  authValidator.signInValidator(),
  authController.login
);

module.exports = authRouter;

const { Router } = require("express");

const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/login", authController.login);

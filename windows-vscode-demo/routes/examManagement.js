const { Router } = require("express");

const examManagementController = require("../controllers/examManagement");
const examManagementValidator = require("../validators/examManagement");

const examManagementRouter = new Router();

examManagementRouter.post(
  "/create-exam",
  examManagementValidator.createExamValidator(),
  examManagementController.createExam
);

examManagementRouter.put(
  "/create-invigilation-instance",
  examManagementValidator.createInvigilationInstanceValidator(),
  examManagementController.createInvigilationInstance
);

module.exports = examManagementRouter;

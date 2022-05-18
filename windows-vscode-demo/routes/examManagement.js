const { Router } = require("express");

const examManagementController = require("../controllers/examManagement");
const examManagementValidator = require("../validators/examManagement");

const examManagementRouter = new Router();

examManagementRouter.post(
  "/create-exam",
  examManagementValidator.createExamValidator(),
  examManagementController.createExam
);

// examManagementRouter.put(examManagementController.editExam);

// examManagementRouter.delete(examManagementController.deleteExam);

// examManagementRouter.get(examManagementController.getExam);

module.exports = examManagementRouter;

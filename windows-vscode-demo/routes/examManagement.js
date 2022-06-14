const { Router } = require("express");

const examManagementController = require("../controllers/examManagement");
const examManagementValidator = require("../validators/examManagement");

const examManagementRouter = new Router();

examManagementRouter.post(
  "/create-exam",
  examManagementValidator.createExamValidator(),
  examManagementController.createExam
);

examManagementRouter.patch(
  "/update-exam-invigilation-info",
  examManagementValidator.updateExamInvigilationInfoValidator(),
  examManagementController.updateExamInvigilationInfo
);

// examManagementRouter.put(
//   "/create-invigilation-instance",
//   examManagementValidator.createInvigilationInstanceValidator(),
//   examManagementController.createInvigilationInstance
// );

module.exports = examManagementRouter;

const { Router } = require("express");
const studentController = require("../controllers/student");
const studentValidator = require("../validators/student");

const studentRouter = Router();

studentRouter.get(
  "/exams",
  studentValidator.getStudentExamsValidator(),
  studentController.getStudentExams
);
studentRouter.get(
  "/get-current-exam",
  studentValidator.getCurrentExamValidator(),
  studentController.getCurrentExam
);
studentRouter.patch(
  "/connect-to-exam",
  studentValidator.connectToExamValidator(),
  studentController.connectToExam
);

module.exports = studentRouter;

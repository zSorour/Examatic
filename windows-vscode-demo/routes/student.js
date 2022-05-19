const { Router } = require("express");
const studentController = require("../controllers/student");

const studentRouter = Router();

studentRouter.get("/exams", studentController.getStudentExams);
studentRouter.get("/get-current-exam", studentController.getCurrentExam);
studentRouter.get("/connect-to-exam", studentController.connectToExam);

module.exports = studentRouter;

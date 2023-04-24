const { Router } = require("express");
const instructorController = require("../controllers/instructor");
const instructorValidator = require("../validators/instructor");

const instructorRouter = Router();

instructorRouter.get(
  "/courses",
  instructorValidator.getInstructorCoursesValidator(),
  instructorController.getInstructorCourses
);

instructorRouter.get(
  "/exams",
  instructorValidator.getInstructorExamsValidator(),
  instructorController.getInstructorExams
);

module.exports = instructorRouter;

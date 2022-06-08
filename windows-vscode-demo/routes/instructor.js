const { Router } = require("express");
const instructorController = require("../controllers/instructor");
const instructorValidator = require("../validators/instructor");

const instructorRouter = Router();

// instructorRouter.get("/exams", instructorController.getInstructorExams);
instructorRouter.get(
  "/courses",
  instructorValidator.getInstructorCoursesValidator(),
  instructorController.getInstructorCourses
);

module.exports = instructorRouter;

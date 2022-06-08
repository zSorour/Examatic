const { check } = require("express-validator");

module.exports.getInstructorCoursesValidator = () => [
  check("username").notEmpty().withMessage("username must not be empty.")
];

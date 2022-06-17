const { check } = require("express-validator");

module.exports.getStudentExamsValidator = () => [
  check("username").notEmpty().withMessage("username must not be empty.")
];

module.exports.getCurrentExamValidator = () => [
  check("username").notEmpty().withMessage("username must not be empty.")
];

module.exports.connectToExamValidator = () => [
  check("username").notEmpty().withMessage("username must not be empty."),
  check("examID").notEmpty().withMessage("examID must not be empty.")
];

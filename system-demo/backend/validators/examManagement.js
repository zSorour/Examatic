const { check } = require("express-validator");

module.exports.createExamValidator = () => [
  check("name").notEmpty().withMessage("Exam name must not be empty."),
  check("name")
    .matches(/^\S*$/)
    .withMessage("Exam name must not contain spaces"),
  check("duration").notEmpty().withMessage("Exam duration must not be empty."),
  check("duration").custom((value) => {
    if (value < 60) {
      throw new Error("Exam duration must be at least 60 minutes.");
    }
    return true;
  }),
  check("startDateTime")
    .isISO8601()
    .withMessage(
      "Start date time must follow ISO 8601. Example: 2020-01-01T00:00:00Z"
    ),
  check("courseCode").notEmpty().withMessage("Course code must not be empty."),
  check("courseName").notEmpty().withMessage("Course name must not be empty."),
  check("instructorID")
    .notEmpty()
    .withMessage("Instructor ID (createdBy) must not be empty."),
  check("instanceTemplateName")
    .notEmpty()
    .withMessage("Instance template must not be empty.")
];

module.exports.updateExamInvigilationInfoValidator = () => [
  check("examID").notEmpty().withMessage("Exam ID must not be empty."),
  check("instanceIP")
    .notEmpty()
    .withMessage("Invigilation instance IP cannot be empty"),
  check("instanceIP")
    .isIP()
    .withMessage("Invigilation instance IP must be in a correct IP format"),
  check("socketID").notEmpty().withMessage("Socket ID cannot be empty.")
];

module.exports.getExamValidator = () => [
  check("examID").notEmpty().withMessage("Exam ID must not be empty.")
];

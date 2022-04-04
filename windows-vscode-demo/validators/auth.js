const { check } = require("express-validator");

module.exports.signInValidator = () => [
  check("username").notEmpty().withMessage("Username must not be empty."),
  check("password").notEmpty().withMessage("Password must not be empty."),
  check("role").custom((value) => {
    if (value !== "Student" && value !== "Instructor") {
      throw new Error("Role must be a Student or an Instructor");
    }
    return true;
  })
];

module.exports.registerValidator = () => [
  check("username").notEmpty().withMessage("Username must not be empty."),
  check("password").notEmpty().withMessage("Password must not be empty."),
  check("name").notEmpty().withMessage("Name must not be empty"),
  check("role").custom((value) => {
    if (value !== "Student" && value !== "Instructor") {
      throw new Error("Role must be a Student or an Instructor");
    }
    return true;
  })
];

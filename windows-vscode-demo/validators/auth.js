const { check } = require("express-validator");

module.exports.signInValidator = () => [
  check("username").notEmpty().withMessage("Username must not be empty."),
  check("password").notEmpty().withMessage("Password must not be empty."),
  check("role").custom((value) => {
    if (!value === "Student" || "Instructor") {
      throw new Error("Role must be a Student or an Instructor");
    }
    return true;
  })
];

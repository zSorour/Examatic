const { model } = require("mongoose");

const StudentSchema = require("../db/Schema/Student");

const Student = model("Student", StudentSchema);
module.exports = Student;

const { model } = require("mongoose");

const InstructorSchema = require("../db/Schema/Instructor");

const Instructor = model("Student", InstructorSchema);
module.exports = InstructorSchema;

const { model } = require("mongoose");

const CourseSchema = require("../db/Schema/Course");

const Course = model("Student", CourseSchema);
module.exports = Course;

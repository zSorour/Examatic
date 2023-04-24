const { model, models } = require("mongoose");

const CourseSchema = require("../db/Schema/Course");

const Course = model("Course", CourseSchema);
module.exports = models.Course || Course;

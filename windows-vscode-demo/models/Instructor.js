const { model, models } = require("mongoose");

const InstructorSchema = require("../db/Schema/Instructor");

const Instructor = model("Instructor", InstructorSchema);
module.exports = models.Instructor || Instructor;

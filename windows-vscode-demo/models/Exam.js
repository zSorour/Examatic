const { model } = require("mongoose");

const ExamSchema = require("../db/Schema/Exam");

const Exam = model("Exam", ExamSchema);
module.exports = Exam;

const { model, models } = require("mongoose");

const ExamSchema = require("../db/Schema/Exam");

const Exam = model("Exam", ExamSchema);
module.exports = models.Exam || Exam;

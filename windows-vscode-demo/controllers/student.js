const terraformService = require("../services/terraform");

const HttpError = require("../models/HTTPError");
const Student = require("../models/Student");

module.exports.getStudentExams = async (req, res, next) => {
  const studentUsername = req.query.username;
  let student;
  try {
    student = await Student.findOne({ username: studentUsername });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Couldn't get the current exam."],
      500
    );
    return next(error);
  }

  if (!student) {
    const error = new HttpError(
      "Invalid Student",
      ["No student with the given username exists."],
      404
    );
    return next(error);
  }

  try {
    await student.populate("enrolledExams");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Couldn't get the student's exams"],
      500
    );
    return next(error);
  }

  const studentExams = student.enrolledExams.map((exam) => {
    return { name: exam.name, duration: exam.duration };
  });

  res.send({
    studentExams: studentExams
  });
};

module.exports.getCurrentExam = async (req, res, next) => {
  const studentUsername = req.query.username;
  let student;
  try {
    student = await Student.findOne({ username: studentUsername });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Couldn't get the current exam."],
      500
    );
    return next(error);
  }

  if (!student) {
    const error = new HttpError(
      "Invalid Student",
      ["No student with the given username exists."],
      404
    );
    return next(error);
  }

  if (!student.currentExam.examDetails) {
    const error = new HttpError(
      "No Current Exam",
      ["There is no current exam registered, please connect to an exam."],
      404
    );
    return next(error);
  }

  try {
    await student.populate("currentExam.examDetails");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Couldn't get the current exam."],
      500
    );
    return next(error);
  }

  res.send({
    examDetails: {
      examName: student.currentExam.examDetails.name,
      examDuration: student.currentExam.examDetails.duration
    },
    instanceDetails: student.currentExam.assignedInstance
  });
};

module.exports.connectToExam = async (req, res, next) => {
  const studentUsername = req.body.username;
  console.log(studentUsername);
  const terraformDir = "terraform/exam_instance";

  let terraformResult;

  try {
    terraformResult = await terraformService.createTerraformInfrastructure(
      terraformDir,
      studentUsername
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Couldn't connect you to exam, please try again later."],
      500
    );
    return next(error);
  }

  res.send({
    msg: "Instance created successfully.",
    public_ip: terraformResult.instance_ip,
    temp_password: terraformResult.temp_password
  });
};

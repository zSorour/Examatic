const terraformService = require("../services/terraform");

const HttpError = require("../models/HTTPError");
const studentService = require("../services/student");
const examService = require("../services/exam");

module.exports.getStudentExams = async (req, res, next) => {
  const studentUsername = req.query.username;

  let enrolledExams;
  try {
    enrolledExams = await studentService.getStudentExams(studentUsername);
  } catch (error) {
    return next(error);
  }

  const studentExams = enrolledExams.map((exam) => {
    return {
      id: exam._id,
      name: exam.name,
      duration: exam.duration,
      startDateTime: exam.startDateTime
    };
  });

  res.send({
    studentExams: studentExams
  });
};

module.exports.getCurrentExam = async (req, res, next) => {
  const studentUsername = req.query.username;

  let currentExam;
  try {
    currentExam = await studentService.getCurrentExam(studentUsername);
  } catch (error) {
    return next(error);
  }

  res.send({
    examDetails: {
      examName: currentExam.examDetails.name,
      examDuration: currentExam.examDetails.duration
    },
    instanceDetails: currentExam.assignedInstance
  });
};

module.exports.connectToExam = async (req, res, next) => {
  const { username, examID } = req.body;

  let exam;

  try {
    await studentService.isStudentEnrolledIntoExam(username, examID);
    exam = await examService.getExam(examID);
  } catch (err) {
    return next(err);
  }

  const terraformDir = "terraform/exam_instance";
  const tfVariables = [
    {
      name: "vpc_id",
      value: exam.vpcID
    },
    {
      name: "security_group_id",
      value: exam.sgID
    }
  ];
  let terraformResult;
  try {
    terraformResult = await terraformService.createTerraformInfrastructure(
      terraformDir,
      username,
      tfVariables
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

  const instanceIP = terraformResult.instance_ip.value;
  const tempPassword = terraformResult.temp_password.value;

  try {
    await studentService.setCurrentExam(
      username,
      examID,
      instanceIP,
      tempPassword
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
    publicIP: instanceIP,
    tempPassword: tempPassword
  });
};

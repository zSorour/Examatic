const { validationResult } = require("express-validator");

const HttpError = require("../models/HTTPError");
const terraformService = require("../services/terraform");
const examService = require("../services/exam");
const instanceTemplateSerivce = require("../services/instanceTemplate");
const instructorService = require("../services/instructor");

module.exports.createExam = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Exam Data", validationErrors, 422);
    return next(error);
  }

  const {
    name,
    duration,
    startDateTime,
    courseName,
    courseCode,
    instructorID,
    instanceTemplateName
  } = req.body;

  // Call promises in parallel. If anyone fails/rejects, all promises are rejected.
  let promisesResults;
  try {
    promisesResults = await Promise.all([
      instructorService.isInstructorEnrolledToCourse(
        instructorID,
        courseName,
        courseCode
      ),
      instanceTemplateSerivce.doesInstanceTemplateExist(instanceTemplateName),
      examService.isExamUnique(name)
    ]);
  } catch (error) {
    return next(error);
  }

  // Use array destructuring to get the results of both promises.
  const [instructor, instanceTemplate] = promisesResults;

  // Create a VPC and a security group for the exam.
  const terraformDir = "terraform/exam_vpc";
  let terraformResult;
  try {
    const startTime = performance.now();
    terraformResult = await terraformService.createTerraformInfrastructure(
      terraformDir,
      name
    );
    console.log(
      `Exam network infrastructure created in: ${
        performance.now() - startTime
      } ms`
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Failure to create exam, please try again later."],
      500
    );
    return next(error);
  }

  try {
    await examService.createExam(
      name,
      duration,
      startDateTime,
      instructor._id,
      courseName,
      courseCode,
      instanceTemplate,
      terraformResult
    );
    res.status(201).send({ message: "Exam created successfully!" });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Failure to create exam, please try again later."],
      500
    );
    return next(error);
  }
};

module.exports.createInvigilationInstance = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Exam Data", validationErrors, 422);
    return next(error);
  }

  const { examID } = req.body;

  let exam;

  try {
    exam = await examService.getExam(examID);
  } catch (err) {
    console.log(err);
    return next(err);
  }

  // call terraform service to create an invigilation instance.
  const terraformDir = "terraform/invigilation_instance";
  let terraformResult;
  try {
    const startTime = performance.now();
    terraformResult = await terraformService.createTerraformInfrastructure(
      terraformDir,
      exam.name
    );
    console.log(
      `Exam invigilation instance created in: ${
        performance.now() - startTime
      } ms`
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Failure to create invigilation instance, please try again later."],
      500
    );
    return next(error);
  }

  // TODO: generate peer id from PeerJS

  // set the invigilation instance in the exam.
  exam.invigilationInstance = {
    instanceIP: terraformResult.instance_ip.value,
    // TODO: set peerID to peer id generated above
    instancePassword: terraformResult.instance_password.value
  };

  // save (update) exam info
  try {
    exam.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Server Error",
      ["Failure to create exam, please try again later."],
      500
    );
    return next(error);
  }

  res.send({ message: "Invigilation instance created successfully!" });
};

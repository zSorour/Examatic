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
    courseCode,
    instructorID,
    instanceTemplateName
  } = req.body;

  // Call promises in parallel. If anyone fails/rejects, all promises are rejected.
  let promisesResults;
  try {
    promisesResults = await Promise.all([
      instructorService.isInstructorEnrolledToCourse(instructorID, courseCode),
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

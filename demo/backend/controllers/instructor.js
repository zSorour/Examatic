const { validationResult } = require("express-validator");
const instructorService = require("../services/instructor.js");
const HttpError = require("../models/HTTPError");

module.exports.getInstructorCourses = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Data", validationErrors, 422);
    return next(error);
  }

  const instructorUsername = req.query.username;

  let assignedCourses;
  try {
    assignedCourses = await instructorService.getInstructorCourses(
      instructorUsername
    );
  } catch (error) {
    return next(error);
  }

  res.send({
    assignedCourses: assignedCourses
  });
};

module.exports.getInstructorExams = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Data", validationErrors, 422);
    return next(error);
  }

  const instructorUsername = req.query.username;

  let assignedExams;
  try {
    assignedExams = await instructorService.getInstructorExams(
      instructorUsername
    );
  } catch (error) {
    return next(error);
  }

  const instructorExams = assignedExams.map((exam) => {
    return {
      id: exam._id,
      name: exam.name,
      courseName: exam.courseName,
      duration: exam.duration,
      startDateTime: exam.startDateTime,
      invigilationInfo: exam.invigilationInstance
    };
  });

  res.send({
    instructorExams: instructorExams
  });
};

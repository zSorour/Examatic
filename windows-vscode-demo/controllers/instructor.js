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

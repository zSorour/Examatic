const { ObjectId } = require("mongoose").Types;
const { validationResult } = require("express-validator");

const mongoose = require("mongoose");

const HttpError = require("../models/HTTPError");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const Exam = require("../models/Exam");
const Course = require("../models/Course");
const InstanceTemplate = require("../models/InstanceTemplate");

module.exports.createExam = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Exam Data", validationErrors, 422);
    return next(error);
  }

  const { name, duration, courseCode, instructorID, instanceTemplateName } =
    req.body;

  // A function that creates a promise to check an instructor with the given ID is enrolled to the course with the given code.
  const instructorPromise = new Promise(async (resolve, reject) => {
    const instructor = await Instructor.findOne({
      _id: ObjectId(instructorID),
      assignedCourses: course._id
    });

    if (instructor) {
      resolve(instructor);
    } else {
      reject(
        new HttpError(
          "Invalid Instructor / Course",
          [
            "No instructor with the given ID is assigned to the specified course."
          ],
          404
        )
      );
    }
  });

  // A function that creates a promise to ensure that the instance template exists.
  const instanceTemplatePromise = new Promise(async (resolve, reject) => {
    const instanceTemplate = await InstanceTemplate.findOne({
      name: instanceTemplateName
    });

    if (instanceTemplate) {
      resolve(instanceTemplate);
    } else {
      reject(
        new HttpError(
          "Invalid Instance Template",
          ["No instance template with the given name exists."],
          404
        )
      );
    }
  });

  // Call both promises in parallel. If anyone fails/rejects, all promises are rejected.
  let promisesResults;
  try {
    promisesResults = await Promise.all([
      instructorPromise,
      instanceTemplatePromise
    ]);
  } catch (error) {
    return next(error);
  }

  // Use array destructuring to get the results of both promises.
  const [instructor, instanceTemplate] = promisesResults;

  let newExam = new Exam({
    name: name.toUpperCase(),
    duration,
    createdBy: ObjectId(instructor._id),
    instanceTemplate: instanceTemplate
  });

  // Creating the exam is an atomic operation, a transaction is needed. If any of the steps fail, the whole operation fails.
  // Promise.all is also used for parallel execution of multiple promises.
  try {
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const course = await Course.findOne(
        { code: courseCode },
        { enrolledStudents: 1 }
      );
      newExam.enrolledStudents = course.enrolledStudents;
      await Promise.all([
        newExam.save({ session }),
        Student.updateMany(
          { enrolledCourses: course._id },
          { $push: { enrolledExams: newExam._id } },
          { session }
        ),
        Instructor.updateMany(
          { assignedCourses: course._id },
          { $push: { assignedExams: newExam._id } },
          { session }
        )
      ]);
    });
    await session.commitTransaction();
    session.endSession();
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

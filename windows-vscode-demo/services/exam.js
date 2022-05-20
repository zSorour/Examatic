const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");

const HttpError = require("../models/HTTPError");
const Exam = require("../models/Exam");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

module.exports.isExamUnique = async (name) => {
  const promise = new Promise(async (resolve, reject) => {
    let exam;
    try {
      exam = await Exam.findOne({ name: name.toUpperCase() });
    } catch (err) {
      const error = new HttpError(
        "Server Error",
        ["The server failed processing your request, please try again later."],
        500
      );
      reject(error);
    }

    if (exam) {
      reject(
        new HttpError(
          "Exam Already Exists",
          ["An exam with the same name already exists."],
          422
        )
      );
    } else {
      resolve();
    }
  });
  return promise;
};

module.exports.createExam = async (
  name,
  duration,
  instructorID,
  courseCode,
  instanceTemplate,
  terraformResult
) => {
  console.log(instructorID);
  let newExam = new Exam({
    name: name.toUpperCase(),
    duration,
    createdBy: instructorID,
    instanceTemplate: instanceTemplate,
    vpcID: terraformResult.vpc_id.value,
    sgID: terraformResult.sg_id.value
  });

  const promise = new Promise(async (resolve, reject) => {
    try {
      const session = await mongoose.startSession();

      await session.withTransaction(async () => {
        const course = await Course.findOne(
          { code: courseCode },
          { enrolledStudents: 1 }
        );
        newExam.enrolledStudents = course.enrolledStudents;

        await newExam.save({ session });
        await Student.updateMany(
          { enrolledCourses: course._id },
          { $push: { enrolledExams: newExam._id } },
          { session }
        );
        await Instructor.updateMany(
          { assignedCourses: course._id },
          { $push: { assignedExams: newExam._id } },
          { session }
        );
      });

      await session.commitTransaction();
      session.endSession();
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  return promise;
};

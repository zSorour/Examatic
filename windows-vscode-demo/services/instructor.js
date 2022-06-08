const { ObjectId } = require("mongoose").Types;

const HttpError = require("../models/HTTPError");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

module.exports.isInstructorEnrolledToCourse = async (
  instructorID,
  courseName,
  courseCode
) => {
  const promise = new Promise(async (resolve, reject) => {
    let instructor;
    const error = new HttpError(
      "Invalid Instructor / Course",
      ["No instructor with the given ID is assigned to the specified course."],
      404
    );

    try {
      const course = await Course.findOne({
        name: courseName,
        code: courseCode
      });
      instructor = await Instructor.findOne({
        _id: ObjectId(instructorID),
        assignedCourses: course._id
      });
    } catch (err) {
      reject(error);
    }

    if (instructor) {
      resolve(instructor);
    } else {
      reject(error);
    }
  });

  return promise;
};

module.exports.getInstructorCourses = async (username) => {
  const promise = new Promise(async (resolve, reject) => {
    let instructor;
    try {
      instructor = await Instructor.findOne({ username: username });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get instructor's courses."],
        500
      );
      return reject(error);
    }

    if (!instructor) {
      const error = new HttpError(
        "Invalid Instructor",
        ["No instructor with the given username exists."],
        404
      );
      return reject(error);
    }

    try {
      await instructor.populate("assignedCourses");
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get instructor's courses."],
        500
      );
      return reject(error);
    }

    resolve(instructor.assignedCourses);
  });

  return promise;
};

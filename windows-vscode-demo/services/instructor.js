const { ObjectId } = require("mongoose").Types;

const HttpError = require("../models/HTTPError");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

module.exports.isInstructorEnrolledToCourse = async (
  instructorID,
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
      console.log(courseCode);
      console.log(instructorID);
      const course = await Course.findOne({ code: courseCode });
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

const { Schema, ObjectId } = require("mongoose");

const CourseSchema = new Schema({
  name: {
    type: "String",
    required: true
  },
  code: {
    type: "String",
    required: true
  },
  enrolledStudents: [
    {
      type: ObjectId,
      ref: "Student"
    }
  ],
  enrolledInstructors: [
    {
      type: ObjectId,
      ref: "Instructor"
    }
  ]
});

module.exports = CourseSchema;

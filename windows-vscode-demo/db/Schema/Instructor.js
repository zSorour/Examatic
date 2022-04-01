const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CourseSchema = require("./Course");

const InstructorSchema = new Schema({
  username: {
    type: "String",
    required: true,
    unique: true
  },
  password: {
    type: "String",
    required: true,
    select: false
  },
  name: {
    type: "String",
    required: true
  },
  assignedCourses: [
    {
      type: ObjectId,
      ref: "Course"
    }
  ],
  assignedExams: [
    {
      type: ObjectId,
      ref: "Exam"
    }
  ]
});

InstructorSchema.plugin(uniqueValidator);

module.exports = InstructorSchema;

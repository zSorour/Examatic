const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CourseSchema = require("./Course");

const StudentSchema = new Schema({
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
  enrolledCourses: [CourseSchema],
  currentExam: {
    examDetails: {
      type: ObjectId,
      ref: "Exam"
    },
    instance_ip: {
      type: "String"
    },
    instance_pass: {
      type: "String"
    }
  }
});

StudentSchema.plugin(uniqueValidator);

module.exports = StudentSchema;

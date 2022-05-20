const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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

CourseSchema.plugin(uniqueValidator);

module.exports = CourseSchema;

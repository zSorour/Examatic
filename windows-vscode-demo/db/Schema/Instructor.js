const { Schema, ObjectId } = require("mongoose");

const InstructorSchema = new Schema({
  username: {
    type: "String",
    required: true
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


module.exports = InstructorSchema;

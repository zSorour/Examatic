const { Schema, ObjectId } = require("mongoose");

const StudentSchema = new Schema({
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
  enrolledCourses: [
    {
      type: ObjectId,
      ref: "Course"
    }
  ],
  enrolledExams: [
    {
      type: ObjectId,
      ref: "Exam"
    }
  ],
  currentExam: {
    examDetails: {
      type: ObjectId,
      ref: "Exam"
    },
    assignedInstance: {
      instanceIP: {
        type: "String"
      },
      instancePassword: {
        type: "String"
      }
    }
  }
});

module.exports = StudentSchema;

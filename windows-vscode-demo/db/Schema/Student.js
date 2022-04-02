const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const StudentSchema = new Schema({
  username: {
    type: "String",
    required: true,
    index: {
      unique: true,
      collation: {
        locale: "en",
        strength: 2
      }
    }
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

StudentSchema.plugin(uniqueValidator);

module.exports = StudentSchema;

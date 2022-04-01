const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const InstanceTemplateSchema = require("./InstanceTemplate");
const InstructorSchema = require("./Instructor");

const ExamSchema = new Schema({
  name: {
    type: "String",
    required: true,
    unique: true
  },
  duration: {
    type: "Number",
    required: true
  },
  enrolledStudents: [
    {
      type: ObjectId,
      ref: "Student"
    }
  ],
  createdBy: InstructorSchema,
  instanceTemplate: InstanceTemplateSchema,
  invigilationInstance: {
    instanceIP: {
      type: "String"
    },
    instancePassword: {
      type: "String"
    }
  }
});

ExamSchema.plugin(uniqueValidator);

module.exports = ExamSchema;

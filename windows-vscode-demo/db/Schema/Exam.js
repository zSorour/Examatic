const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const InstanceTemplateSchema = require("./InstanceTemplate");

const ExamSchema = new Schema({
  name: {
    type: "String",
    required: true
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
  createdBy: {
    type: ObjectId,
    ref: "Instructor"
  },
  instanceTemplate: InstanceTemplateSchema,
  invigilationInstance: {
    instanceIP: {
      type: "String"
    },
    instancePassword: {
      type: "String"
    },
    select: false
  },
  vpcID: {
    type: "String",
    required: true,
    select: false
  },
  sgID: {
    type: "String",
    required: true,
    select: false
  }
});

ExamSchema.plugin(uniqueValidator);

module.exports = ExamSchema;

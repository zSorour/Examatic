const { Schema, ObjectId } = require("mongoose");

const InstanceTemplateSchema = require("./InstanceTemplate");

const ExamSchema = new Schema({
  name: {
    type: "String",
    required: true
  },
  courseName: {
    type: "String",
    required: true
  },
  duration: {
    type: "Number",
    required: true
  },
  startDateTime: {
    type: "String",
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
    socketID: {
      type: "String"
    },
    instancePassword: {
      type: "String"
    }
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

module.exports = ExamSchema;

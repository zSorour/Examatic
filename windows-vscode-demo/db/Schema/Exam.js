const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const InstanceTemplateSchema = require("./InstanceTemplate");

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
  instanceTemplate: InstanceTemplateSchema
});

ExamSchema.plugin(uniqueValidator);

module.exports = ExamSchema;

const { Schema, ObjectId } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CourseSchema = new Schema({
  name: {
    type: "String",
    required: true
  },
  code: {
    type: "String",
    required: true,
    unique: true
  }
});

CourseSchema.plugin(uniqueValidator);

module.exports = CourseSchema;

const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const InstanceTemplateSchema = new Schema({
  name: {
    type: "String",
    required: true
  },
  os: {
    type: "String",
    required: true
  },
  installedSoftware: [{ type: "String" }],
  description: {
    type: "String",
    required: true
  }
});

InstanceTemplateSchema.plugin(uniqueValidator);

module.exports = InstanceTemplateSchema;

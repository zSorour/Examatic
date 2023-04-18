const { Schema } = require("mongoose");

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

module.exports = InstanceTemplateSchema;

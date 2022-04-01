const { model } = require("mongoose");

const InstanceTemplateSchema = require("../db/Schema/InstanceTemplate");

const InstanceTemplate = model("InstanceTemplate", InstanceTemplateSchema);
module.exports = InstanceTemplate;

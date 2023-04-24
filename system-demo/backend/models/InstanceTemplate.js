const { model, models } = require("mongoose");

const InstanceTemplateSchema = require("../db/Schema/InstanceTemplate");

const InstanceTemplate = model("InstanceTemplate", InstanceTemplateSchema);
module.exports = models.InstanceTemplate || InstanceTemplate;

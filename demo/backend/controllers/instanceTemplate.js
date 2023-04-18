const instanceTemplateService = require("../services/instanceTemplate");

module.exports.getInstanceTemplates = async (req, res, next) => {
  let instanceTemplates;
  try {
    instanceTemplates = await instanceTemplateService.getInstanceTemplates();
  } catch (error) {
    return next(error);
  }

  res.send({
    instanceTemplates: instanceTemplates
  });
};

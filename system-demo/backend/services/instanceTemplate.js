const HttpError = require("../models/HTTPError");
const InstanceTemplate = require("../models/InstanceTemplate");

module.exports.doesInstanceTemplateExist = async (instanceTemplateName) => {
  const promise = new Promise(async (resolve, reject) => {
    let instanceTemplate;
    try {
      instanceTemplate = await InstanceTemplate.findOne({
        name: instanceTemplateName
      });
    } catch (err) {
      const error = new HttpError(
        "Server Error",
        ["The server failed processing your request, please try again later"],
        500
      );
      reject(error);
    }

    if (instanceTemplate) {
      resolve(instanceTemplate);
    } else {
      reject(
        new HttpError(
          "Invalid Instance Template",
          ["No instance template with the given name exists."],
          404
        )
      );
    }
  });
  return promise;
};

module.exports.getInstanceTemplates = async () => {
  const promise = new Promise(async (resolve, reject) => {
    let instanceTemplates;
    try {
      instanceTemplates = await InstanceTemplate.find();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get instance templates."],
        500
      );
      return reject(error);
    }

    resolve(instanceTemplates);
  });

  return promise;
};

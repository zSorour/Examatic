const { Router } = require("express");
const instanceTemplateController = require("../controllers/instanceTemplate");

const instanceTemplateRouter = Router();

instanceTemplateRouter.get(
  "/",
  instanceTemplateController.getInstanceTemplates
);

module.exports = instanceTemplateRouter;

const express = require("express");
const Router = express.Router();

const welcomeController = require("../controller/Welcome");

Router.get(
    "/get-organization-welcome/:id",
    welcomeController.getOrganizationWelcomeKits
);

Router.get(
    "/get-spedific-welcome-kit/:id",
    welcomeController.getSpecificWelcomeKit
);

Router.post("/create-welcome-kit", welcomeController.createWelcomeKit);
Router.put("/update-welcome-kit/:id", welcomeController.updateWelcomeKit);

module.exports = Router;

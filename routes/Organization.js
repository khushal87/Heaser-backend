const express = require("express");
const organizationController = require("../controller/Organization");
const organizationAuthController = require("../controller/OrganizationAuth");

const Router = express.Router();

Router.post(
    "/create-organization",
    organizationAuthController.createOrganization
);
Router.post(
    "/login-organization",
    organizationAuthController.loginOrganization
);
Router.get("/get-all-organizations", organizationController.getOrganizations);
Router.get(
    "/get-specific-organization/:id",
    organizationController.getSpecificOrganization
);
Router.delete(
    "/delete-organization/:id",
    organizationController.deleteOrganization
);
Router.put("/change-password/:id", organizationAuthController.changePassword);

module.exports = Router;

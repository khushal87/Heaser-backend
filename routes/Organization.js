const express = require("express");
const organizationController = require("../controller/Organization");

const Router = express.Router();

Router.get("/get-all-organizations", organizationController.getOrganizations);

module.exports = Router;

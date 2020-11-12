const express = require("express");
const Router = express.Router();

const employeeController = require("../controller/Employee");
const employeeAuthController = require("../controller/EmployeeAuth");

Router.post("/create-employee", employeeAuthController.createEmployee);
Router.post("/login", employeeAuthController.loginUser);
Router.put("/change-password/:id", employeeAuthController.changePassword);

Router.get(
    "/get-employess-by-org-id/:id",
    employeeController.getSpecificOrganizationsEmployee
);

Router.get(
    "/get-specific-employee/:id",
    employeeController.getSpecificEmployee
);

Router.delete("/delete-employee/:id", employeeController.deleteEmployee);

module.exports = Router;

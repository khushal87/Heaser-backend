const express = require("express");
const Router = express.Router();
const leaveControllers = require("../controller/Leave");

Router.get("/get-all-leaves", leaveControllers.getLeaves);
Router.get("/get-employee-leaves/:id", leaveControllers.getEmployeeLeaves);
Router.get(
    "/get-organization-leaves/:id",
    leaveControllers.getOrganizationLeaves
);
Router.post("/create-leave", leaveControllers.createLeave);
Router.put("/accept-leave", leaveControllers.acceptLeave);

module.exports = Router;

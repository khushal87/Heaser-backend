const express = require("express");
const timeController = require("../controller/Time");

const Router = express.Router();

Router.get("/get-time-for-employees/:id", timeController.getTime);
Router.post("/get-employee-time/:id", timeController.getTimeForUser);
Router.post("/create-time-for-employee/:id", timeController.createTimeForUser);
Router.put("/update-time-for-employee/:id", timeController.updateTimeForUser);

module.exports = Router;

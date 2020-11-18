const express = require("express");
const Router = express.Router();
const notificationController = require("../controller/Notification");

Router.get(
    "/get-employee-notification/:id",
    notificationController.getAllNotification
);

module.exports = Router;

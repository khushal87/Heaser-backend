const express = require("express");
const Router = express.Router();
const notificationController = require("../controller/Notification");

Router.get(
    "/get-employee-notification/:id",
    notificationController.getAllNotification
);

Router.get(
    "/get-organization-notification/:id",
    notificationController.getOrganizationNotification
);

Router.put(
    "/mark-notification-seen/:id",
    notificationController.markNotificationSeen
);

module.exports = Router;

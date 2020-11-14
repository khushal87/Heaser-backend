const express = require("express");
const Router = express.Router();

const announcementController = require("../controller/Announcement");

Router.get(
    "/get-announcements-by-org/:id",
    announcementController.getAnnouncementsOfOrganization
);
Router.get(
    "/get-specific-announcement/:id",
    announcementController.getSpecificAnnouncement
);

Router.post("/create-announcement", announcementController.createAnnouncement);
Router.delete(
    "/delete-announcement/:id",
    announcementController.deleteAnnouncement
);

module.exports = Router;

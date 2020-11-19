const { validationResult } = require("express-validator");
const Organization = require("../model/Organization");
const Announcement = require("../model/Announcement");
const Notification = require("../model/Notification");

exports.getAnnouncementsOfOrganization = (req, res, next) => {
    const id = req.params.id;
    Organization.findById(id).then((result) => {
        if (!result) {
            const error = new Error("Could not find organization.");
            error.status = 404;
            throw error;
        } else {
            Announcement.find()
                .then((result) => {
                    res.status(200).json({
                        message: "Announcements fetched",
                        data: result,
                    });
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        }
    });
};

exports.getSpecificAnnouncement = (req, res, next) => {
    const id = req.params.id;
    Announcement.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find announcement.");
                error.status = 404;
                throw error;
            } else {
                res.status(200).json({
                    message: "Announcement fetched",
                    organization: result,
                });
            }
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createAnnouncement = (req, res, next) => {
    const { organization } = req.body;
    Organization.findById(organization)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                const { heading, description } = req.body;
                const announcement = new Announcement({
                    heading,
                    description,
                    organization,
                });
                return announcement.save();
            }
        })
        .then(async (result) => {
            await Notification.create({
                message: "You have a new announcement by organization",
                operation: "Announcement",
                actor: organization,
            });
            await res.status(200).json({
                message:
                    "Announcement created Successfully by the organization.",
                time: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteAnnouncement = (req, res, next) => {
    const { id } = req.params;
    Announcement.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find announcement.");
                error.status = 404;
                throw error;
            } else {
                return Announcement.findByIdAndRemove(result._id);
            }
        })
        .then((result) => {
            res.status(200).json({
                message: "Deleted announcement successfully!",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

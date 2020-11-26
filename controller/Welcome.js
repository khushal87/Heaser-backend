const Employee = require("../model/Employee");
const Notification = require("../model/Notification");
const Organization = require("../model/Organization");
const Welcome = require("../model/Welcome");

exports.getOrganizationWelcomeKits = (req, res, next) => {
    const id = req.params.id;
    Organization.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                Welcome.find({ organization: id })
                    .then((result) => {
                        res.status(200).json({
                            message: "Welcome fetched",
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
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getSpecificWelcomeKit = (req, res, next) => {
    const id = req.params.id;
    Welcome.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find result.");
                error.status = 404;
                throw error;
            } else {
                res.status(200).json({
                    message: "Welcome kit fetched",
                    data: result,
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

exports.createWelcomeKit = (req, res, next) => {
    const { employee, organization } = req.body;
    Organization.findById(organization)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                Employee.findById(employee)
                    .then((result) => {
                        if (!result) {
                            const error = new Error("Could not find employee.");
                            error.status = 404;
                            throw error;
                        } else {
                            const { status, is_delivered, type } = req.body;
                            const welcome = new Welcome({
                                employee,
                                organization,
                                status,
                                is_delivered,
                                type,
                            });
                            return welcome.save();
                        }
                    })
                    .then((result) => {
                        Notification.create({
                            message:
                                "You have a new announcement from your organization",
                            operation: "Announcement",
                            actor: employee,
                        });
                        res.status(200).json({
                            message: "New welcome kit added",
                            data: result,
                        });
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

exports.updateWelcomeKit = (req, res, next) => {
    const id = req.params.id;
    Welcome.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find kit.");
                error.status = 404;
                throw error;
            } else {
                const { is_delivered, status } = req.body;
                status ? (result.status = status) : "";
                is_delivered != null
                    ? (result.is_delivered = is_delivered)
                    : "";
                return result.save();
            }
        })
        .then((result) => {
            res.status(200).send({
                message: "Welcome kit updated successfully!",
                data: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

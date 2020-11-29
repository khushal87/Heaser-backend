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
                    .populate("employee")
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

exports.createWelcomeKit = async (req, res, next) => {
    const { employee, organization } = req.body;
    await Organization.findById(organization)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                await Employee.findById(employee)
                    .then(async (result) => {
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
                    .then(async (result) => {
                        Notification.create({
                            message:
                                "Your organization has gifted you a new welcome it. We are gald to have you on board.",
                            operation: "Announcement",
                            actor: employee,
                        });
                        const data = await Employee.findById(employee);
                        await res.status(200).json({
                            message: "New welcome kit added",
                            data: result,
                            employee: data,
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

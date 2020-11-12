const { validationResult } = require("express-validator");
const Organization = require("../model/Organization");

exports.getOrganizations = (req, res, next) => {
    Organization.find()
        .then((result) => {
            res.status(200).json({
                message: "Organizations fetched",
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

exports.getSpecificOrganization = (req, res, next) => {
    const { id } = req.params;
    Organization.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                res.status(200).json({
                    message: "Organization fetched",
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

exports.deleteOrganization = (req, res, next) => {
    const { id } = req.params;
    Organization.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                return Organization.findByIdAndRemove(result._id);
            }
        })
        .then((result) => {
            res.status(200).json({
                message: "Deleted organization successfully!",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

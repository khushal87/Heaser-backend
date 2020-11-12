const { validationResult } = require("express-validator");
const Employee = require("../model/Employee");
const Organization = require("../model/Organization");

exports.getSpecificOrganizationsEmployee = (req, res, next) => {
    const orgId = req.params.id;
    Organization.findById(orgId)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                Employee.find().then((result) => {
                    res.status(200).json({
                        message: "Employees fetched",
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

exports.getSpecificEmployee = (req, res, next) => {
    const id = req.params.id;
    Employee.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                res.status(200).json({
                    message: "Employee fetched",
                    employee: result,
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

exports.deleteEmployee = (req, res, next) => {
    const { id } = req.params;
    Employee.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                return Employee.findByIdAndRemove(result._id);
            }
        })
        .then((result) => {
            res.status(200).json({ message: "Deleted employee successfully!" });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

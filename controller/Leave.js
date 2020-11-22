const { validationResult } = require("express-validator");
const Employee = require("../model/Employee");
const Leave = require("../model/Leave");
const Notification = require("../model/Notification");
const Organization = require("../model/Organization");

exports.getLeaves = (req, res, next) => {
    Leave.find()
        .then((result) => {
            res.status(200).json({
                message: "Leaves fetched",
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

exports.getEmployeeLeaves = async (req, res, next) => {
    const empId = req.params.id;
    await Employee.findById(empId)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                await Leave.find({ employee: empId }).then((result) => {
                    res.status(200).json({
                        message: "Leaves fetched",
                        leaves: result,
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

exports.createLeave = async (req, res, next) => {
    const empId = req.body.employee;
    await Employee.findById(empId)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                const {
                    startDate,
                    endDate,
                    reason,
                    is_female,
                    female_leave_reason,
                } = req.body;
                const leave = new Leave({
                    startDate,
                    endDate,
                    reason,
                    is_female,
                    female_leave_reason,
                    employee: empId,
                });

                await Notification.create({
                    message: `${result.name}, from your organization has requested a leave`,
                    operation: "Leave",
                    type: "organization",
                    actor: result.organization,
                });
                await leave.save().then(async (result) => {
                    await res.status(200).json({
                        message: "Leave submitted successfully",
                        leave: result,
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

exports.acceptLeave = async (req, res, next) => {
    const { leaveId, orgId } = req.body;
    await Organization.findById(orgId)
        .then(async (org) => {
            if (!org) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                await Leave.findById(leaveId)
                    .then(async (result) => {
                        if (!result) {
                            const error = new Error("Could not find leave.");
                            error.status = 404;
                            throw error;
                        }
                        result.accepted = true;
                        result.accepted_by = orgId;
                        await Notification.create({
                            message: `Your leave was accepted by your organization ${org.name}`,
                            operation: "Leave",
                            actor: result.employee,
                        });
                        return await result.save();
                    })
                    .then(async (result) => {
                        await res.status(200).json({
                            message: "Leave granted successfully!",
                            result: result,
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

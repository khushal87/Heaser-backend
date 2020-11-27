const { validationResult } = require("express-validator");
const Task = require("../model/Task");
const Employee = require("../model/Employee");
const moment = require("moment");
const Notification = require("../model/Notification");

exports.getEmployeeTasks = async (req, res, next) => {
    const id = req.params.id;
    await Employee.findById(id)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                await Task.find({ to: id })
                    .sort({ createdAt: -1 })
                    .populate("from")
                    .then(async (result) => {
                        const data = await result.filter((item) => {
                            return (
                                moment(new Date()).format("YYYY-MM-DD H:mm") <=
                                moment(item.endDate).format("YYYY-MM-DD H:mm")
                            );
                        });
                        console.log(data.length);
                        await res.status(200).json({
                            message: "Tasks fetched",
                            tasks: data,
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

exports.getTasksAllocatedByEmployee = async (req, res, next) => {
    const id = req.params.id;
    await Employee.findById(id)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                await Task.find({ from: id }).then((result) => {
                    res.status(200).json({
                        message: "Tasks fetched",
                        tasks: result,
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

exports.createTask = async (req, res, next) => {
    const { from, to } = req.body;
    await Employee.findById(from)
        .then(async (resultFrom) => {
            if (!resultFrom) {
                const error = new Error("Could not find from employee.");
                error.status = 404;
                throw error;
            } else {
                await Employee.findById(to).then(async (result) => {
                    if (!result) {
                        const error = new Error(
                            "Could not find from employee."
                        );
                        error.status = 404;
                        throw error;
                    } else {
                        const {
                            heading,
                            description,
                            startDate,
                            endDate,
                            comments,
                        } = req.body;
                        const task = new Task({
                            from,
                            to,
                            heading,
                            description,
                            startDate,
                            endDate,
                            comments,
                        });
                        await task.save().then(async (result) => {
                            await Notification.create({
                                actor: to,
                                operation: "Task",
                                message: `You are aloted a new task by ${resultFrom.name}`,
                            });
                            await res.status(200).json({
                                message: "Task created successfully",
                                task: result,
                            });
                        });
                    }
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

exports.updateTask = async (req, res, next) => {
    const taskId = req.params.id;
    await Task.findById(taskId)
        .then(async (task) => {
            if (!task) {
                const error = new Error("Could not find task.");
                error.status = 404;
                throw error;
            }
            const {
                heading,
                description,
                startDate,
                endDate,
                comments,
            } = req.body;

            heading ? (task.heading = heading) : "";
            description ? (task.description = description) : "";
            startDate ? (task.startDate = startDate) : "";
            endDate ? (task.endDate = endDate) : "";
            comments ? (task.comments = comments) : "";
            await task.save();
        })
        .then(async (result) => {
            await res.status(200).json({
                message: "Updated task successfully!",
                result: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.markTaskAsCompleted = async (req, res, next) => {
    const taskId = req.params.id;
    const { comments } = req.body;

    await Task.findById(taskId)
        .then(async (task) => {
            if (!task) {
                const error = new Error("Could not find task.");
                error.status = 404;
                throw error;
            }

            task.isCompleted = true;
            task.comments = comments;
            return task.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Task completed successfully!",
                result: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

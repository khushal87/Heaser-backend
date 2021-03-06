const Employee = require("../model/Employee");
const Time = require("../model/Time");

exports.getTimeInInterval = (req, res, next) => {
    const empId = req.params.id;
    Employee.findById(empId)
        .then((result) => {
            if (!result) {
                const error = new Error("No employee exists with this id.");
                error.statusCode = 401;
                throw error;
            } else {
                let { startDate, endDate } = req.body;
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                console.log(startDate, endDate);

                Time.find({ employee: empId })
                    .then((result) => {
                        const data = result.filter((item) => {
                            const date = new Date(item.day);
                            console.log(date);
                            return date >= startDate && date <= endDate;
                        });
                        return data;
                    })
                    .then((result) => {
                        res.status(200).json({
                            message: "Employee time fetched",
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

exports.getTime = (req, res, next) => {
    const empId = req.params.id;
    Employee.findById(empId)
        .then((result) => {
            if (!result) {
                const error = new Error("No employee exists with this id.");
                error.statusCode = 401;
                throw error;
            }
            Time.find({ employee: empId }).then((result) => {
                res.status(200).json({
                    message: "Employee time fetched",
                    data: result,
                });
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getTimeForUser = (req, res, next) => {
    const empId = req.params.id;
    Employee.findById(empId)
        .then((result) => {
            if (!result) {
                const error = new Error("No employee exists with this id.");
                error.statusCode = 401;
                throw error;
            }
            const day = req.body.day;
            Time.find({ day: day }).then((result) => {
                res.status(200).json({
                    message: "Employee time fetched",
                    data: result.filter((item) => item.employee == empId),
                });
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createTimeForUser = (req, res, next) => {
    const empId = req.params.id;
    Employee.findById(empId)
        .then((result) => {
            if (!result) {
                const error = new Error("No employee exists with this id.");
                error.statusCode = 401;
                throw error;
            }
            const { day, total_time } = req.body;
            const time = new Time({ day, total_time, employee: empId });
            return time.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Time created Successfully for the employee.",
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

exports.updateTimeForUser = (req, res, next) => {
    const timeId = req.params.id;
    Time.findById(timeId)
        .then((result) => {
            if (!result) {
                const error = new Error("No time exists with this id.");
                error.statusCode = 401;
                throw error;
            }
            const { total_time } = req.body;
            result.total_time = total_time;
            return result.save();
        })
        .then((result) => {
            res.status(200).send({
                message: "Time details updated successfully!",
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

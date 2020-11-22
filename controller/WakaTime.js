const WakaTime = require("../model/Wakatime");
const Employee = require("../model/Employee");

exports.getSpecificEmployeeWakaTimeId = async (req, res, next) => {
    const id = req.params.id;
    await Employee.findById(id)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            } else {
                await WakaTime.find({ employee: id }).then(async (result) => {
                    await res.status(200).json({
                        message: "User wakatime Id is",
                        data: result[0].wakatimeId,
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

exports.createEmployeeWakatimeId = async (req, res, next) => {
    const { employee, wakatimeId } = req.body;
    await Employee.findById(employee)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find from employee.");
                error.status = 404;
                throw error;
            } else {
                const wakatime = new WakaTime({
                    employee,
                    wakatimeId,
                });
                await wakatime.save().then(async (result) => {
                    await res.status(200).json({
                        message: "Id created successfully",
                        task: result,
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

const WakaTime = require("../model/Wakatime");
const Employee = require("../model/Employee");
const defaults = require("../config/dev");
const { default: Axios } = require("axios");

exports.mainWakaTimeFunctionality = (req, res, next) => {
    const code = req.body.code;
    const formData = new FormData();
    // formData.append("clie")
    const params = {
        client_id: defaults.WAKATIME_CLIENT_ID,
        client_secret: defaults.WAKATIME_CLIENT_SECRET,
        redirect_uri: defaults.WAKATIME_REDIRECT_URI,
        grant_type: "authorization_code",
        code: code,
    };
    console.log(params);
    Axios.post("https://wakatime.com/oauth/token", params)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err.response.data);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

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

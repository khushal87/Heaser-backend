const Employee = require("../model/Employee");
const Message = require("../model/Message");

exports.handlerUserIsOnline = async (empId) => {
    const empObj = await Employee.findById(empId);
    empObj["lastSeen"] = "Online";
    await empObj.save();
};

exports.handlerUserIsOffline = async (empId) => {
    const empObj = await Employee.findById(empId);
    empObj["lastSeen"] = new Date().toLocaleString();
    await empObj.save();
};

exports.createMessage = async (params) => {
    return params.msg;
};

exports.getChatHistory = async (req, res, next) => {
    const roomId = req.body.roomId;

    await Message.find({
        roomId: roomId,
    })
        .then((result) => {
            res.status(200).json({
                message: "Messages Fetched",
                messages: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

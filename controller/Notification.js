const Notification = require("../model/Notification");
const Employee = require("../model/Employee");

exports.getAllNotification = async (req, res, next) => {
    const id = req.params.id;
    await Employee.findById(id)
        .then(async (result) => {
            if (!result) {
                const error = new Error("Could not find employee.");
                error.status = 404;
                throw error;
            }
            const notifications = await Notification.find({
                actor: id,
            }).populate("actor");
            let uncheckedNotif = 0;
            notifications.map((notif) => {
                if (
                    new Date(notif.createdAt).getTime() >
                    new Date(result.lastNotificationsCheckedAt).getTime()
                ) {
                    uncheckedNotif++;
                }
            });
            result["lastNotificationsCheckedAt"] = Date.now();
            result.save();
            return res.status(200).send({
                data: notifications,
                uncheckedNotif: uncheckedNotif,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

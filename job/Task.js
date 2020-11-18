const Cron = require("node-schedule");
const moment = require("moment");

const Task = require("../model/Task");
const Notification = require("../model/Notification");

class TaskCron {
    constructor() {}

    async sendTaskNotification() {
        return Cron.scheduleJob("00 00 00 * * *", async () => {
            const currentDate = moment().format("YYYY-MM-DD");

            const task = await Task.find();
            const tasks = task.filter(
                (item) =>
                    moment(item.startDate).format("YYYY-MM-DD") <=
                        currentDate &&
                    currentDate <= moment(item.endDate).format("YYYY-MM-DD")
            );
            tasks.map((item) => {
                return Notification.create({
                    actor: item.to,
                    operation: "task",
                    message: "You have a pending task to complete.",
                });
            });
        });
    }
}

const taskCron = new TaskCron();
try {
    taskCron.sendTaskNotification();
} catch (err) {
    console.log(err);
}

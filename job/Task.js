const Cron = require("node-schedule");
const moment = require("moment");

const Task = require("../model/Task");
const Notification = require("../model/Notification");

class TaskCron {
    constructor() {}

    async sendTaskNotification() {
        return Cron.scheduleJob("00 00 00 * * *", async () => {
            const currentDate = moment().format("L");
            const task = await Task.find();
            const tasks = task.filter(
                (item) =>
                    item.startDate <= currentDate && currentDate <= item.endDate
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

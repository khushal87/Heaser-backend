const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        actor: {
            type: String,
            required: true,
        },
        operation: { type: String },
        message: { type: String, required: true },
        type: {
            type: String,
            required: true,
            default: "employee",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

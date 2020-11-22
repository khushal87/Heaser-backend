const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        actor: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Employee" || "Organization",
        },
        operation: { type: String },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

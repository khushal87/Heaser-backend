const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        to: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: [
                true,
                "Please provide the id of the user to whom you want to allocate task.",
            ],
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: [
                true,
                "Please provide the id of the user who is allocating the task.",
            ],
        },
        heading: {
            type: String,
            required: [true, "Please provide a heading"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        startDate: {
            type: Date,
            required: [true, "Please provide a start date"],
        },
        endDate: {
            type: String,
            required: [true, "Please provide a end date"],
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

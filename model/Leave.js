const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: [true, "Please enter your employee Id"],
    },
    date: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    is_female: {
        type: Boolean,
        default: false,
    },
    female_leave_reason: {
        type: String,
        default: "",
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    accepted_by: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
    },
});

module.exports = mongoose.model("Leave", leaveSchema);
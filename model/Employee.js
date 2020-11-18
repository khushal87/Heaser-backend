const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            select: false,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            required: [true, "No organization provided"],
            ref: "Organization",
        },
        lastSeen: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);

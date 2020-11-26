const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const welcomeSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        status: {
            type: String,
            required: "Initiated",
        },
        is_delivered: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Welcome", welcomeSchema);

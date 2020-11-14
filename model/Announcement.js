const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annoucementSchema = new Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", annoucementSchema);

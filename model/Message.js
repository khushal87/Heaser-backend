const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Employee",
        },
        to: { type: mongoose.Types.ObjectId, required: true, ref: "Employee" },
        text: { type: String, default: null },
        roomId: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

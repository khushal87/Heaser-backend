const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wakatimeSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    wakatimeId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Wakatime", wakatimeSchema);

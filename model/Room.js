const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: { type: String, default: null },
});

module.exports = mongoose.model("Room", roomSchema);

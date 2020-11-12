const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    day: {
      type: Date,
      required: true,
    },
    total_time: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("time", timeSchema);

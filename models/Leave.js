const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["casual", "medical"], required: true },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Leave", LeaveSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  leaveBalance: {
    casual: { type: Number, default: 10 },
    medical: { type: Number, default: 5 },
  },
});

module.exports = mongoose.model("User", UserSchema);

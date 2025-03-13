const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Leave = require("../models/Leave");
const User = require("../models/User");

const router = express.Router();

// Apply Leave
router.post("/apply", authMiddleware, async (req, res) => {
  const { type, startDate, endDate } = req.body;
  const user = await User.findById(req.user.id);

  if (user.leaveBalance[type] <= 0) {
    return res.status(400).json({ message: "Insufficient leave balance" });
  }

  const leave = new Leave({ user: req.user.id, type, startDate, endDate });
  await leave.save();

  user.leaveBalance[type] -= 1;
  await user.save();

  res.status(201).json({ message: "Leave applied successfully" });
});

// Get leave requests
router.get("/", authMiddleware, async (req, res) => {
  const leaves = await Leave.find({ user: req.user.id });
  res.json(leaves);
});

// Admin: Approve/Reject leave
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  leave.status = status;
  await leave.save();

  res.json({ message: `Leave ${status}` });
});

module.exports = router;

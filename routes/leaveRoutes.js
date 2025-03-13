const express = require("express");
const Leave = require("../models/Leave");
const User = require("../models/User");

const router = express.Router();

// Apply Leave Page
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.render("applyLeave", { user: req.session.user, message: "" });
});

// Apply Leave
router.post("/apply", async (req, res) => {
  if (!req.session.user) return res.redirect("/");

  const { type, startDate, endDate } = req.body;
  const user = await User.findById(req.session.user._id);

  if (user.leaveBalance[type] <= 0) {
    return res.render("applyLeave", { user, message: "Insufficient leave balance" });
  }

  const leave = new Leave({ user: user._id, type, startDate, endDate });
  await leave.save();

  user.leaveBalance[type] -= 1;
  await user.save();

  res.redirect("/leaves");
});

// View Leave Requests
router.get("/requests", async (req, res) => {
  if (!req.session.user) return res.redirect("/");
  const leaves = await Leave.find({ user: req.session.user._id });
  res.render("viewLeaves", { leaves });
});

// Admin Page: View All Leave Requests
router.get("/admin", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");
  const leaves = await Leave.find().populate("user");
  res.render("adminDashboard", { leaves });
});

// Approve/Reject Leave (Admin)
router.post("/admin/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");
  const { status } = req.body;
  await Leave.findByIdAndUpdate(req.params.id, { status });
  res.redirect("/leaves/admin");
});

module.exports = router;

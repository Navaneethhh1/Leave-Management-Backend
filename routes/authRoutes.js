const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register Page
router.get("/register", (req, res) => {
  res.render("register", { message: "" });
});

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.redirect("/");
  } catch (error) {
    res.render("register", { message: "Email already exists" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("index", { message: "Invalid credentials" });
  }

  req.session.user = user;
  if (user.role === "admin") {
    res.redirect("/leaves/admin");
  } else {
    res.redirect("/leaves");
  }
});

module.exports = router;

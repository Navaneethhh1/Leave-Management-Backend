const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
require("dotenv").config();

connectDB();
const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/leaves", leaveRoutes);

// Homepage (Login Page)
app.get("/", (req, res) => {
  res.render("index", { message: "" });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

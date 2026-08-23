const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ],
    unique: true,
  },

  passwordHash: {
    type: String,
    required: [true, "Password hash is required"],
  },

  role: {
    type: String,
    required: [true, "Role is required"],
    enum: {
      values: [
        "FLEET_MANAGER",
        "DRIVER",
        "SAFETY_OFFICER",
        "FINANCIAL_ANALYST",
      ],
      message: "Invalid user role",
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
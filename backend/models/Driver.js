const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    sparse: true,
  },

  name: {
    type: String,
    required: [true, "Driver name is required"],
    trim: true,
    minlength: [1, "Driver name cannot be empty"],
  },

  licenseNumber: {
    type: String,
    required: [true, "License number is required"],
    unique: true,
    trim: true,
    minlength: [1, "License number cannot be empty"],
  },

  licenseCategory: {
    type: String,
    required: [true, "License category is required"],
    trim: true,
    minlength: [1, "License category cannot be empty"],
  },

  licenseExpiryDate: {
    type: Date,
    required: [true, "License expiry date is required"],
  },

  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true,
  },

  safetyScore: {
    type: Number,
    required: [true, "Safety score is required"],
    min: [0, "Safety score cannot be less than 0"],
    max: [100, "Safety score cannot be greater than 100"],
  },

  status: {
    type: String,
    required: [true, "Driver status is required"],
    enum: {
      values: ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"],
      message: "Invalid driver status",
    },
  },
});

driverSchema.index({
  status: 1,
  licenseExpiryDate: 1,
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
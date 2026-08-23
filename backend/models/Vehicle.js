const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Vehicle type is required"],
      trim: true,
    },

    maxLoadCapacity: {
      type: Number,
      required: [true, "Maximum load capacity is required"],
      min: [0.01, "Maximum load capacity must be greater than 0"],
    },

    odometer: {
      type: Number,
      required: [true, "Odometer is required"],
      min: [0, "Odometer cannot be negative"],
    },

    acquisitionCost: {
      type: Number,
      required: [true, "Acquisition cost is required"],
      min: [0, "Acquisition cost cannot be negative"],
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"],
        message: "Invalid vehicle status",
      },
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
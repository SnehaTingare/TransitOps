const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Vehicle is required"],
    ref: "Vehicle",
  },

  description: {
    type: String,
    required: [true, "Maintenance description is required"],
    trim: true,
  },

  cost: {
    type: Number,
    required: [true, "Maintenance cost is required"],
    min: [0, "Maintenance cost cannot be negative"],
  },

  startDate: {
    type: Date,
    required: [true, "Maintenance start date is required"],
  },

  endDate: {
    type: Date,
  },

  status: {
    type: String,
    required: [true, "Maintenance status is required"],
    enum: {
      values: ["ACTIVE", "CLOSED"],
      message: "Invalid maintenance status",
    },
  },
});

maintenanceLogSchema.index({
  vehicleId: 1,
  status: 1,
});

const MaintenanceLog = mongoose.model(
  "MaintenanceLog",
  maintenanceLogSchema
);

module.exports = MaintenanceLog;
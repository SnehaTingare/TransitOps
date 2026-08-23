const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Vehicle is required"],
    ref: "Vehicle",
  },

  liters: {
    type: Number,
    required: [true, "Fuel quantity is required"],
    min: [0.01, "Fuel quantity must be greater than 0"],
  },

  cost: {
    type: Number,
    required: [true, "Fuel cost is required"],
    min: [0, "Fuel cost cannot be negative"],
  },

  date: {
    type: Date,
    required: [true, "Fuel date is required"],
  },
});

fuelLogSchema.index({
  vehicleId: 1,
  date: 1,
});

const FuelLog = mongoose.model("FuelLog", fuelLogSchema);

module.exports = FuelLog;
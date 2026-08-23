const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, "Trip source is required"],
    trim: true,
  },

  destination: {
    type: String,
    required: [true, "Trip destination is required"],
    trim: true,
  },

  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Vehicle is required"],
    ref: "Vehicle",
  },

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Driver is required"],
    ref: "Driver",
  },

  cargoWeight: {
    type: Number,
    required: [true, "Cargo weight is required"],
    min: [0, "Cargo weight cannot be negative"],
  },

  plannedDistance: {
    type: Number,
    required: [true, "Planned distance is required"],
    min: [0.01, "Planned distance must be greater than 0"],
  },

  startOdometer: {
    type: Number,
    required: [true, "Start odometer is required"],
    min: [0, "Start odometer cannot be negative"],
  },

  finalOdometer: {
    type: Number,
    min: [0, "Final odometer cannot be negative"],
    validate: {
      validator: function (value) {
        if (value === undefined || value === null) {
          return true;
        }

        return value >= this.startOdometer;
      },
      message: "Final odometer must be greater than or equal to start odometer",
    },
  },

  fuelConsumedLiters: {
    type: Number,
    min: [0, "Fuel consumed cannot be negative"],
  },

  revenue: {
    type: Number,
    min: [0, "Revenue cannot be negative"],
  },

  status: {
    type: String,
    required: [true, "Trip status is required"],
    enum: {
      values: ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"],
      message: "Invalid trip status",
    },
  },
});

tripSchema.index({
  status: 1,
});

tripSchema.index({
  vehicleId: 1,
  status: 1,
});

tripSchema.index({
  driverId: 1,
  status: 1,
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
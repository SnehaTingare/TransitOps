const mongoose = require("mongoose");

const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");

const normalizeFuelLog = (fuelLog) => ({
  id: fuelLog._id,
  vehicleId: fuelLog.vehicleId,
  liters: fuelLog.liters,
  cost: fuelLog.cost,
  date: fuelLog.date,
});

const validateVehicleId = (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new Error("Invalid vehicle ID");
  }
};

const validateDate = (date, fieldName = "date") => {
  if (date === undefined || date === null) {
    throw new Error(`${fieldName} is required`);
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const createFuelLog = async (fuelData) => {
  const {
    vehicleId,
    liters,
    cost,
    date,
  } = fuelData;

  // Validate vehicle ID
  validateVehicleId(vehicleId);

  // Validate date
  validateDate(date);

  // Liters must be > 0
  if (
    liters === undefined ||
    liters === null ||
    Number.isNaN(Number(liters)) ||
    Number(liters) <= 0
  ) {
    throw new Error("Invalid liters");
  }

  // Cost must be >= 0
  if (
    cost === undefined ||
    cost === null ||
    Number.isNaN(Number(cost)) ||
    Number(cost) < 0
  ) {
    throw new Error("Invalid cost");
  }

  // Check vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  // Create fuel log
  const fuelLog = await FuelLog.create({
    vehicleId,
    liters,
    cost,
    date,
  });

  return normalizeFuelLog(fuelLog);
};

const getFuelLogs = async (filters = {}) => {
  const {
    vehicleId,
    from,
    to,
  } = filters;

  const query = {};

  // Filter by vehicle
  if (vehicleId !== undefined) {
    validateVehicleId(vehicleId);
    query.vehicleId = vehicleId;
  }

  // Filter from date
  if (from !== undefined) {
    validateDate(from, "from date");

    query.date = {
      ...query.date,
      $gte: new Date(from),
    };
  }

  // Filter to date
  if (to !== undefined) {
    validateDate(to, "to date");

    query.date = {
      ...query.date,
      $lte: new Date(to),
    };
  }

  const fuelLogs = await FuelLog.find(query).sort({
    date: -1,
  });

  return fuelLogs.map(normalizeFuelLog);
};

module.exports = {
  createFuelLog,
  getFuelLogs,
};
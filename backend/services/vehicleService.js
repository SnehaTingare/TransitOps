const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const MaintenanceLog = require("../models/MaintenanceLog");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");

const VEHICLE_STATUSES = [
  "AVAILABLE",
  "ON_TRIP",
  "IN_SHOP",
  "RETIRED",
];

const normalizeVehicle = (vehicle) => ({
  id: vehicle._id,
  registrationNumber: vehicle.registrationNumber,
  model: vehicle.model,
  type: vehicle.type,
  maxLoadCapacity: vehicle.maxLoadCapacity,
  odometer: vehicle.odometer,
  acquisitionCost: vehicle.acquisitionCost,
  region: vehicle.region,
  status: vehicle.status,
});

const validateVehicleId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid vehicle ID");
  }
};

const validateStatus = (status) => {
  if (status !== undefined && !VEHICLE_STATUSES.includes(status)) {
    throw new Error("Invalid vehicle status");
  }
};

const createVehicle = async (vehicleData) => {
  const {
    registrationNumber,
    model,
    type,
    maxLoadCapacity,
    odometer,
    acquisitionCost,
    region,
    status,
  } = vehicleData;

  validateStatus(status);

  const existingVehicle = await Vehicle.findOne({
    registrationNumber: registrationNumber.trim().toUpperCase(),
  });

  if (existingVehicle) {
    throw new Error("Registration number already exists");
  }

  const vehicle = await Vehicle.create({
    registrationNumber,
    model,
    type,
    maxLoadCapacity,
    odometer,
    acquisitionCost,
    region,
    status: status || "AVAILABLE",
  });

  return normalizeVehicle(vehicle);
};

const getVehicles = async (filters = {}) => {
  const { type, status, region } = filters;

  validateStatus(status);

  const query = {};

  if (type !== undefined) {
    if (!type.trim()) {
      throw new Error("Invalid vehicle type filter");
    }

    query.type = type.trim();
  }

  if (status !== undefined) {
    query.status = status;
  }

  if (region !== undefined) {
    if (!region.trim()) {
      throw new Error("Invalid region filter");
    }

    query.region = region.trim();
  }

  const vehicles = await Vehicle.find(query).sort({
    registrationNumber: 1,
  });

  return vehicles.map(normalizeVehicle);
};

const getVehicleById = async (id) => {
  validateVehicleId(id);

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  return normalizeVehicle(vehicle);
};

const updateVehicle = async (id, updateData) => {
  validateVehicleId(id);

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const allowedFields = [
    "registrationNumber",
    "model",
    "type",
    "maxLoadCapacity",
    "odometer",
    "acquisitionCost",
    "region",
  ];

  const update = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      update[field] = updateData[field];
    }
  }

  if (updateData.status !== undefined) {
    throw new Error(
      "Vehicle status cannot be updated through the vehicle update API"
    );
  }

  if (update.registrationNumber !== undefined) {
    const normalizedRegistrationNumber =
      update.registrationNumber.trim().toUpperCase();

    const existingVehicle = await Vehicle.findOne({
      registrationNumber: normalizedRegistrationNumber,
      _id: { $ne: id },
    });

    if (existingVehicle) {
      throw new Error(
        "Registration number already belongs to another vehicle"
      );
    }

    update.registrationNumber = normalizedRegistrationNumber;
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    update,
    {
      new: true,
      runValidators: true,
    }
  );

  return normalizeVehicle(updatedVehicle);
};

const deleteVehicle = async (id) => {
  validateVehicleId(id);

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const [
    tripExists,
    maintenanceExists,
    fuelLogExists,
    expenseExists,
  ] = await Promise.all([
    Trip.exists({ vehicleId: id }),
    MaintenanceLog.exists({ vehicleId: id }),
    FuelLog.exists({ vehicleId: id }),
    Expense.exists({ vehicleId: id }),
  ]);

  if (
    tripExists ||
    maintenanceExists ||
    fuelLogExists ||
    expenseExists
  ) {
    throw new Error(
      "Vehicle has trips, maintenance logs, fuel logs or expenses and cannot be deleted"
    );
  }

  await Vehicle.findByIdAndDelete(id);

  return {
    message: "Vehicle deleted successfully",
  };
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
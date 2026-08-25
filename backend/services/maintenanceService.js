const mongoose = require("mongoose");

const MaintenanceLog = require("../models/MaintenanceLog");
const Vehicle = require("../models/Vehicle");

const MAINTENANCE_STATUSES = ["ACTIVE", "CLOSED"];

const normalizeMaintenance = (maintenance) => ({
  id: maintenance._id,
  vehicleId: maintenance.vehicleId,
  description: maintenance.description,
  cost: maintenance.cost,
  startDate: maintenance.startDate,
  endDate:
    maintenance.endDate !== undefined
      ? maintenance.endDate
      : null,
  status: maintenance.status,
});

const validateMaintenanceId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid maintenance ID");
  }
};

const validateVehicleId = (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new Error("Invalid vehicle ID");
  }
};

const validateStatus = (status) => {
  if (
    status !== undefined &&
    !MAINTENANCE_STATUSES.includes(status)
  ) {
    throw new Error("Invalid maintenance status");
  }
};

const validateDate = (date, fieldName) => {
  if (date === undefined || date === null) {
    throw new Error(`${fieldName} is required`);
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const createMaintenance = async (maintenanceData) => {
  const {
    vehicleId,
    description,
    cost,
    startDate,
  } = maintenanceData;

  validateVehicleId(vehicleId);
  validateDate(startDate, "start date");

  if (
    cost === undefined ||
    cost === null ||
    Number.isNaN(Number(cost)) ||
    Number(cost) < 0
  ) {
    throw new Error("Invalid maintenance cost");
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.status === "ON_TRIP") {
    throw new Error("Vehicle currently on trip");
  }

  if (vehicle.status === "RETIRED") {
    throw new Error("Vehicle retired");
  }

  const existingActiveMaintenance =
    await MaintenanceLog.findOne({
      vehicleId,
      status: "ACTIVE",
    });

  if (existingActiveMaintenance) {
    throw new Error("Vehicle already in maintenance");
  }

  const maintenance = await MaintenanceLog.create({
    vehicleId,
    description,
    cost,
    startDate,
    status: "ACTIVE",
  });

  vehicle.status = "IN_SHOP";
  await vehicle.save();

  return normalizeMaintenance(maintenance);
};

const getMaintenanceRecords = async (filters = {}) => {
  const { vehicleId, status } = filters;

  validateStatus(status);

  const query = {};

  if (vehicleId !== undefined) {
    validateVehicleId(vehicleId);
    query.vehicleId = vehicleId;
  }

  if (status !== undefined) {
    query.status = status;
  }

  const records = await MaintenanceLog.find(query).sort({
    startDate: -1,
  });

  return records.map(normalizeMaintenance);
};

const closeMaintenance = async (id, endDate) => {
  validateMaintenanceId(id);
  validateDate(endDate, "end date");

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const maintenance = await MaintenanceLog.findById(id).session(
        session
      );

      if (!maintenance) {
        throw new Error("Maintenance record not found");
      }

      if (maintenance.status === "CLOSED") {
        throw new Error("Maintenance record already closed");
      }

      const vehicle = await Vehicle.findById(
        maintenance.vehicleId
      ).session(session);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      maintenance.status = "CLOSED";
      maintenance.endDate = endDate;

      if (vehicle.status !== "RETIRED") {
        vehicle.status = "AVAILABLE";
      }

      await maintenance.save({ session });
      await vehicle.save({ session });

      result = {
        maintenance: {
          id: maintenance._id,
          status: maintenance.status,
          endDate: maintenance.endDate,
        },
        vehicle: {
          id: vehicle._id,
          status: vehicle.status,
        },
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createMaintenance,
  getMaintenanceRecords,
  closeMaintenance,
};
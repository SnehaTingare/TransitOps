const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");
const MaintenanceLog = require("../models/MaintenanceLog");
const Expense = require("../models/Expense");

const validateVehicleId = (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new Error("Invalid vehicle ID");
  }
};

const getVehicleAnalytics = async (filters = {}) => {
  const {
    vehicleId,
    region,
    type,
  } = filters;

  const vehicleQuery = {};

  // Filter by vehicle
  if (vehicleId !== undefined) {
    validateVehicleId(vehicleId);
    vehicleQuery._id = vehicleId;
  }

  // Filter by region
  if (region !== undefined) {
    vehicleQuery.region = region;
  }

  // Filter by vehicle type
  if (type !== undefined) {
    vehicleQuery.type = type;
  }

  const vehicles = await Vehicle.find(vehicleQuery);

  const analytics = await Promise.all(
    vehicles.map(async (vehicle) => {
      /*
       * Get completed trips for this vehicle.
       */
      const trips = await Trip.find({
        vehicleId: vehicle._id,
        status: "COMPLETED",
      });

      /*
       * Total distance travelled.
       */
      const totalDistance = trips.reduce(
        (sum, trip) =>
          sum + Number(trip.plannedDistance || 0),
        0
      );

      /*
       * Total fuel consumed from completed trips.
       */
      const tripFuelConsumed = trips.reduce(
        (sum, trip) =>
          sum + Number(trip.fuelConsumedLiters || 0),
        0
      );

      /*
       * Fuel logs for this vehicle.
       */
      const fuelLogs = await FuelLog.find({
        vehicleId: vehicle._id,
      });

      const fuelCost = fuelLogs.reduce(
        (sum, fuelLog) =>
          sum + Number(fuelLog.cost || 0),
        0
      );

      /*
       * Fuel consumed from fuel logs.
       */
      const loggedFuelLiters = fuelLogs.reduce(
        (sum, fuelLog) =>
          sum + Number(fuelLog.liters || 0),
        0
      );

      /*
       * Use trip fuel consumption when available.
       * Otherwise use fuel log liters.
       */
      const totalFuelConsumed =
        tripFuelConsumed > 0
          ? tripFuelConsumed
          : loggedFuelLiters;

      /*
       * Fuel Efficiency
       *
       * Distance / Fuel Consumed
       */
      const fuelEfficiency =
        totalFuelConsumed > 0
          ? Number(
              (
                totalDistance /
                totalFuelConsumed
              ).toFixed(2)
            )
          : 0;

      /*
       * Maintenance costs.
       */
      const maintenanceLogs =
        await MaintenanceLog.find({
          vehicleId: vehicle._id,
        });

      const maintenanceCost =
        maintenanceLogs.reduce(
          (sum, maintenance) =>
            sum + Number(maintenance.cost || 0),
          0
        );

      /*
       * Operational Cost
       *
       * Fuel Cost + Maintenance Cost
       */
      const operationalCost =
        fuelCost + maintenanceCost;

      /*
       * Revenue from completed trips.
       */
      const revenue = trips.reduce(
        (sum, trip) =>
          sum + Number(trip.revenue || 0),
        0
      );

      /*
       * ROI
       *
       * Revenue - (Maintenance + Fuel)
       * --------------------------------
       * Acquisition Cost
       */
      const roi =
        Number(vehicle.acquisitionCost || 0) > 0
          ? Number(
              (
                (revenue -
                  maintenanceCost -
                  fuelCost) /
                Number(vehicle.acquisitionCost)
              ).toFixed(4)
            )
          : 0;

      /*
       * Fleet Utilization
       *
       * For MVP, utilization is based
       * on the vehicle's current operational status.
       */
      const fleetUtilization =
        vehicle.status === "ON_TRIP"
          ? 100
          : 0;

      return {
        vehicleId: vehicle._id,
        registrationNumber:
          vehicle.registrationNumber,
        fuelEfficiency,
        fleetUtilization,
        operationalCost,
        roi,
      };
    })
  );

  return analytics;
};
const buildDateFilter = (from, to) => {
  const dateFilter = {};

  if (from !== undefined) {
    const fromDate = new Date(from);

    if (Number.isNaN(fromDate.getTime())) {
      throw new Error("Invalid from date");
    }

    dateFilter.$gte = fromDate;
  }

  if (to !== undefined) {
    const toDate = new Date(to);

    if (Number.isNaN(toDate.getTime())) {
      throw new Error("Invalid to date");
    }

    dateFilter.$lte = toDate;
  }

  return dateFilter;
};

const validateExportReport = (report) => {
  const allowedReports = [
    "vehicles",
    "trips",
    "expenses",
    "fuel",
    "analytics",
  ];

  if (!allowedReports.includes(report)) {
    throw new Error("Unsupported report type");
  }
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const convertToCsv = (rows) => {
  if (!rows || rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => escapeCsvValue(row[header]))
        .join(",")
    ),
  ];

  return csvRows.join("\n");
};

const getExportData = async (filters = {}) => {
  const {
    report,
    vehicleId,
    from,
    to,
  } = filters;

  validateExportReport(report);

  if (vehicleId !== undefined) {
    validateVehicleId(vehicleId);

    const vehicleExists = await Vehicle.exists({
      _id: vehicleId,
    });

    if (!vehicleExists) {
      throw new Error("Vehicle not found");
    }
  }

  const dateFilter = buildDateFilter(from, to);

  const vehicleFilter = {};

  if (vehicleId !== undefined) {
    vehicleFilter.vehicleId = vehicleId;
  }

  let rows = [];

  if (report === "vehicles") {
    const query = {};

    if (vehicleId !== undefined) {
      query._id = vehicleId;
    }

    const vehicles = await Vehicle.find(query).lean();

    rows = vehicles.map((vehicle) => ({
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      maxLoadCapacity: vehicle.maxLoadCapacity,
      odometer: vehicle.odometer,
      acquisitionCost: vehicle.acquisitionCost,
      region: vehicle.region,
      status: vehicle.status,
    }));
  }

  if (report === "trips") {
    const query = {
      ...vehicleFilter,
    };

    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    const trips = await Trip.find(query).lean();

    rows = trips.map((trip) => ({
      tripId: trip._id,
      source: trip.source,
      destination: trip.destination,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      cargoWeight: trip.cargoWeight,
      plannedDistance: trip.plannedDistance,
      startOdometer: trip.startOdometer,
      finalOdometer: trip.finalOdometer,
      fuelConsumedLiters: trip.fuelConsumedLiters,
      revenue: trip.revenue,
      status: trip.status,
    }));
  }

  if (report === "fuel") {
    const query = {
      ...vehicleFilter,
    };

    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    const fuelLogs = await FuelLog.find(query).lean();

    rows = fuelLogs.map((fuel) => ({
      fuelLogId: fuel._id,
      vehicleId: fuel.vehicleId,
      liters: fuel.liters,
      cost: fuel.cost,
      date: fuel.date,
    }));
  }

  if (report === "expenses") {
    const query = {
      ...vehicleFilter,
    };

    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    const expenses = await Expense.find(query).lean();

    rows = expenses.map((expense) => ({
      expenseId: expense._id,
      vehicleId: expense.vehicleId,
      type: expense.type,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
    }));
  }

  if (report === "analytics") {
    rows = await getVehicleAnalytics({
      vehicleId,
    });
  }

  return convertToCsv(rows);
};

module.exports = {
  getVehicleAnalytics,
  getExportData,
};
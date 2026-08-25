const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");
const MaintenanceLog = require("../models/MaintenanceLog");

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

module.exports = {
  getVehicleAnalytics,
};
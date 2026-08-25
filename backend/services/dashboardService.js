const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");

const VEHICLE_STATUSES = [
  "AVAILABLE",
  "ON_TRIP",
  "IN_SHOP",
  "RETIRED",
];

const buildVehicleFilter = (filters = {}) => {
  const {
    vehicleType,
    vehicleStatus,
    region,
  } = filters;

  const query = {};

  if (vehicleType !== undefined) {
    query.type = vehicleType;
  }

  if (vehicleStatus !== undefined) {
    if (!VEHICLE_STATUSES.includes(vehicleStatus)) {
      throw new Error("Invalid vehicle status");
    }

    query.status = vehicleStatus;
  }

  if (region !== undefined) {
    query.region = region;
  }

  return query;
};

const getDashboardKPIs = async (filters = {}) => {
  const vehicleFilter = buildVehicleFilter(filters);

  // Vehicles matching the selected dashboard filters
  const filteredVehicles = await Vehicle.find(
    vehicleFilter
  ).select("_id status");

  const vehicleIds = filteredVehicles.map(
    (vehicle) => vehicle._id
  );

  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
  ] = await Promise.all([
    Vehicle.countDocuments({
      ...vehicleFilter,
      status: {
        $in: ["AVAILABLE", "ON_TRIP"],
      },
    }),

    Vehicle.countDocuments({
      ...vehicleFilter,
      status: "AVAILABLE",
    }),

    Vehicle.countDocuments({
      ...vehicleFilter,
      status: "IN_SHOP",
    }),

    Trip.countDocuments({
      vehicleId: { $in: vehicleIds },
      status: "DISPATCHED",
    }),

    Trip.countDocuments({
      vehicleId: { $in: vehicleIds },
      status: "DRAFT",
    }),
  ]);

  const driversOnDuty = await Driver.countDocuments({
    status: "ON_TRIP",
  });

  const totalOperationalVehicles =
    activeVehicles;

  const fleetUtilization =
    totalOperationalVehicles === 0
      ? 0
      : Number(
          (
            (await Vehicle.countDocuments({
              ...vehicleFilter,
              status: "ON_TRIP",
            }) /
              totalOperationalVehicles) *
            100
          ).toFixed(2)
        );

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,
  };
};

module.exports = {
  getDashboardKPIs,
};
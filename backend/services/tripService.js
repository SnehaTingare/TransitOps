const mongoose = require("mongoose");

const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

const TRIP_STATUSES = [
  "DRAFT",
  "DISPATCHED",
  "COMPLETED",
  "CANCELLED",
];

const normalizeTrip = (trip) => ({
  id: trip._id,
  source: trip.source,
  destination: trip.destination,
  vehicleId: trip.vehicleId,
  driverId: trip.driverId,
  cargoWeight: trip.cargoWeight,
  plannedDistance: trip.plannedDistance,
  startOdometer: trip.startOdometer,
  finalOdometer:
    trip.finalOdometer !== undefined ? trip.finalOdometer : null,
  fuelConsumedLiters:
    trip.fuelConsumedLiters !== undefined
      ? trip.fuelConsumedLiters
      : null,
  revenue: trip.revenue !== undefined ? trip.revenue : null,
  status: trip.status,
});

const validateTripId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid trip ID");
  }
};

const validateObjectId = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(message);
  }
};

const validateStatus = (status) => {
  if (
    status !== undefined &&
    !TRIP_STATUSES.includes(status)
  ) {
    throw new Error("Invalid trip status");
  }
};

const validateDispatchEligibility = (vehicle, driver, cargoWeight) => {
  if (vehicle.status !== "AVAILABLE") {
    throw new Error("Vehicle unavailable");
  }

  if (driver.status !== "AVAILABLE") {
    if (driver.status === "SUSPENDED") {
      throw new Error("Driver suspended");
    }

    throw new Error("Driver unavailable");
  }

  if (
    !driver.licenseExpiryDate ||
    new Date(driver.licenseExpiryDate) < new Date()
  ) {
    throw new Error("Driver license expired");
  }

  if (cargoWeight > vehicle.maxLoadCapacity) {
    throw new Error("Cargo exceeds vehicle capacity");
  }
};

const createTrip = async (tripData) => {
  const {
    source,
    destination,
    vehicleId,
    driverId,
    cargoWeight,
    plannedDistance,
    revenue,
  } = tripData;

  validateObjectId(vehicleId, "Invalid vehicle ID");
  validateObjectId(driverId, "Invalid driver ID");

  const [vehicle, driver] = await Promise.all([
    Vehicle.findById(vehicleId),
    Driver.findById(driverId),
  ]);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (!driver) {
    throw new Error("Driver not found");
  }

  validateDispatchEligibility(
    vehicle,
    driver,
    cargoWeight
  );

  const trip = await Trip.create({
    source,
    destination,
    vehicleId,
    driverId,
    cargoWeight,
    plannedDistance,
    startOdometer: vehicle.odometer,
    finalOdometer: undefined,
    fuelConsumedLiters: undefined,
    revenue,
    status: "DRAFT",
  });

  return normalizeTrip(trip);
};

const getTrips = async (filters = {}) => {
  const {
    status,
    vehicleId,
    driverId,
  } = filters;

  validateStatus(status);

  const query = {};

  if (status !== undefined) {
    query.status = status;
  }

  if (vehicleId !== undefined) {
    validateObjectId(
      vehicleId,
      "Invalid vehicle ID"
    );

    query.vehicleId = vehicleId;
  }

  if (driverId !== undefined) {
    validateObjectId(
      driverId,
      "Invalid driver ID"
    );

    query.driverId = driverId;
  }

  const trips = await Trip.find(query).sort({
    _id: -1,
  });

  return trips.map(normalizeTrip);
};

const getTripById = async (id) => {
  validateTripId(id);

  const trip = await Trip.findById(id);

  if (!trip) {
    throw new Error("Trip not found");
  }

  return normalizeTrip(trip);
};

const dispatchTrip = async (id) => {
  validateTripId(id);

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(id).session(session);

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (trip.status !== "DRAFT") {
        throw new Error("Trip is not in Draft state");
      }

      const vehicle = await Vehicle.findById(
        trip.vehicleId
      ).session(session);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const driver = await Driver.findById(
        trip.driverId
      ).session(session);

      if (!driver) {
        throw new Error("Driver not found");
      }

      validateDispatchEligibility(
        vehicle,
        driver,
        trip.cargoWeight
      );

      trip.status = "DISPATCHED";
      trip.startOdometer = vehicle.odometer;

      vehicle.status = "ON_TRIP";
      driver.status = "ON_TRIP";

      await trip.save({ session });
      await vehicle.save({ session });
      await driver.save({ session });

      result = {
        trip: {
          id: trip._id,
          status: trip.status,
        },
        vehicle: {
          id: vehicle._id,
          status: vehicle.status,
        },
        driver: {
          id: driver._id,
          status: driver.status,
        },
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

const completeTrip = async (id, completionData) => {
  validateTripId(id);

  const {
    finalOdometer,
    fuelConsumedLiters,
  } = completionData;

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(id).session(session);

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (trip.status !== "DISPATCHED") {
        throw new Error("Trip is not dispatched");
      }

      if (
        finalOdometer === undefined ||
        finalOdometer < trip.startOdometer
      ) {
        throw new Error(
          "Final odometer must be greater than or equal to start odometer"
        );
      }

      if (
        fuelConsumedLiters === undefined ||
        fuelConsumedLiters < 0
      ) {
        throw new Error(
          "Fuel consumed liters must be greater than or equal to 0"
        );
      }

      const vehicle = await Vehicle.findById(
        trip.vehicleId
      ).session(session);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const driver = await Driver.findById(
        trip.driverId
      ).session(session);

      if (!driver) {
        throw new Error("Driver not found");
      }

      trip.status = "COMPLETED";
      trip.finalOdometer = finalOdometer;
      trip.fuelConsumedLiters = fuelConsumedLiters;

      vehicle.status = "AVAILABLE";
      vehicle.odometer = finalOdometer;

      driver.status = "AVAILABLE";

      await trip.save({ session });
      await vehicle.save({ session });
      await driver.save({ session });

      result = {
        trip: {
          id: trip._id,
          status: trip.status,
          finalOdometer: trip.finalOdometer,
          fuelConsumedLiters:
            trip.fuelConsumedLiters,
        },
        vehicle: {
          id: vehicle._id,
          status: vehicle.status,
          odometer: vehicle.odometer,
        },
        driver: {
          id: driver._id,
          status: driver.status,
        },
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

const cancelTrip = async (id) => {
  validateTripId(id);

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(id).session(session);

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (
        trip.status !== "DRAFT" &&
        trip.status !== "DISPATCHED"
      ) {
        throw new Error(
          "Trip cannot be cancelled from its current state"
        );
      }

      const vehicle = await Vehicle.findById(
        trip.vehicleId
      ).session(session);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const driver = await Driver.findById(
        trip.driverId
      ).session(session);

      if (!driver) {
        throw new Error("Driver not found");
      }

      trip.status = "CANCELLED";

      vehicle.status = "AVAILABLE";
      driver.status = "AVAILABLE";

      await trip.save({ session });
      await vehicle.save({ session });
      await driver.save({ session });

      result = {
        trip: {
          id: trip._id,
          status: trip.status,
        },
        vehicle: {
          id: vehicle._id,
          status: vehicle.status,
        },
        driver: {
          id: driver._id,
          status: driver.status,
        },
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
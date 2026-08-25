const tripService = require("../services/tripService");

const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body);

    return res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    if (
      error.message === "Vehicle not found" ||
      error.message === "Driver not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Vehicle unavailable" ||
      error.message === "Driver unavailable" ||
      error.message === "Driver license expired" ||
      error.message === "Driver suspended" ||
      error.message === "Cargo exceeds vehicle capacity"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid driver ID" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips(req.query);

    return res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    if (
      error.message === "Invalid trip status" ||
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid driver ID"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    if (error.message === "Invalid trip ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Trip not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const dispatchTrip = async (req, res, next) => {
  try {
    const result = await tripService.dispatchTrip(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message === "Invalid trip ID" ||
      error.message === "Trip is not in Draft state"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Trip not found" ||
      error.message === "Vehicle not found" ||
      error.message === "Driver not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Vehicle unavailable" ||
      error.message === "Driver unavailable" ||
      error.message === "Driver license expired" ||
      error.message === "Driver suspended" ||
      error.message === "Cargo exceeds vehicle capacity"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const result = await tripService.completeTrip(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message === "Invalid trip ID" ||
      error.message ===
        "Final odometer must be greater than or equal to start odometer" ||
      error.message ===
        "Fuel consumed liters must be greater than or equal to 0"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Trip not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Trip is not dispatched") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Vehicle not found" ||
      error.message === "Driver not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const cancelTrip = async (req, res, next) => {
  try {
    const result = await tripService.cancelTrip(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message === "Invalid trip ID" ||
      error.message ===
        "Trip cannot be cancelled from its current state"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Trip not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Vehicle not found" ||
      error.message === "Driver not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
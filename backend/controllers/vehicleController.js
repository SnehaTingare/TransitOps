const vehicleService = require("../services/vehicleService");

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error.message === "Registration number already exists") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Invalid vehicle status") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getVehicles(req.query);

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    if (
      error.message === "Invalid vehicle status" ||
      error.message === "Invalid vehicle type filter" ||
      error.message === "Invalid region filter"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error.message === "Invalid vehicle ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (
      error.message === "Invalid vehicle ID" ||
      error.message ===
        "Vehicle status cannot be updated through the vehicle update API"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message ===
      "Registration number already belongs to another vehicle"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === "Invalid vehicle ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message ===
      "Vehicle has trips, maintenance logs, fuel logs or expenses and cannot be deleted"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
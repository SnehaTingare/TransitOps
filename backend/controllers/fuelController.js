const fuelService = require("../services/fuelService");

const createFuelLog = async (req, res, next) => {
  try {
    const fuelLog = await fuelService.createFuelLog(req.body);

    return res.status(201).json({
      success: true,
      data: fuelLog,
    });
  } catch (error) {
    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid liters" ||
      error.message === "Invalid cost" ||
      error.message === "Date is required" ||
      error.message === "Invalid date" ||
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

const getFuelLogs = async (req, res, next) => {
  try {
    const fuelLogs = await fuelService.getFuelLogs(
      req.query
    );

    return res.status(200).json({
      success: true,
      data: fuelLogs,
    });
  } catch (error) {
    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "From date is required" ||
      error.message === "Invalid from date" ||
      error.message === "To date is required" ||
      error.message === "Invalid to date"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  createFuelLog,
  getFuelLogs,
};
const maintenanceService = require("../services/maintenanceService");

const createMaintenance = async (req, res, next) => {
  try {
    const maintenance =
      await maintenanceService.createMaintenance(req.body);

    return res.status(201).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Vehicle already in maintenance" ||
      error.message === "Vehicle currently on trip" ||
      error.message === "Vehicle retired"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid start date" ||
      error.message === "Start date is required" ||
      error.message === "Invalid maintenance cost" ||
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

const getMaintenanceRecords = async (req, res, next) => {
  try {
    const records =
      await maintenanceService.getMaintenanceRecords(req.query);

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid maintenance status"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const closeMaintenance = async (req, res, next) => {
  try {
    const result =
      await maintenanceService.closeMaintenance(
        req.params.id,
        req.body.endDate
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message === "Invalid maintenance ID" ||
      error.message === "Invalid end date" ||
      error.message === "End date is required"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Maintenance record not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Maintenance record already closed") {
      return res.status(409).json({
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

module.exports = {
  createMaintenance,
  getMaintenanceRecords,
  closeMaintenance,
};
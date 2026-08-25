const driverService = require("../services/driverService");

const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body);

    return res.status(201).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    if (
      error.message === "License number already exists" ||
      error.message === "User is already linked to a driver"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Invalid driver status" ||
      error.message === "Invalid license expiry date" ||
      error.message === "Invalid user ID" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "User not found") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getDrivers(req.query);

    return res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    if (
      error.message === "Invalid driver status" ||
      error.message === "Invalid eligible filter"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getDriver = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    if (error.message === "Invalid driver ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Driver not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    if (
      error.message === "Invalid driver ID" ||
      error.message === "Invalid driver status" ||
      error.message === "Invalid license expiry date" ||
      error.message === "Invalid user ID" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Duplicate license number" ||
      error.message === "User is already linked to a driver"
    ) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Driver not found" ||
      error.message === "User not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const result = await driverService.deleteDriver(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === "Invalid driver ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Driver not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message ===
      "Driver has trip records and cannot be deleted"
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
  createDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
};
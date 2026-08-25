const mongoose = require("mongoose");

const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const User = require("../models/User");

const DRIVER_STATUSES = [
  "AVAILABLE",
  "ON_TRIP",
  "OFF_DUTY",
  "SUSPENDED",
];

const normalizeDriver = (driver) => ({
  id: driver._id,
  ...(driver.userId ? { userId: driver.userId } : {}),
  name: driver.name,
  licenseNumber: driver.licenseNumber,
  licenseCategory: driver.licenseCategory,
  licenseExpiryDate: driver.licenseExpiryDate,
  contactNumber: driver.contactNumber,
  safetyScore: driver.safetyScore,
  status: driver.status,
});

const validateDriverId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid driver ID");
  }
};

const validateStatus = (status) => {
  if (
    status !== undefined &&
    !DRIVER_STATUSES.includes(status)
  ) {
    throw new Error("Invalid driver status");
  }
};

const validateDate = (date) => {
  if (date === undefined) {
    return;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid license expiry date");
  }
};

const createDriver = async (driverData) => {
  const {
    userId,
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    safetyScore,
    status,
  } = driverData;

  validateStatus(status);
  validateDate(licenseExpiryDate);

  const normalizedLicenseNumber = licenseNumber.trim();

  const existingLicense = await Driver.findOne({
    licenseNumber: normalizedLicenseNumber,
  });

  if (existingLicense) {
    throw new Error("License number already exists");
  }

  if (userId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const existingLinkedDriver = await Driver.findOne({
      userId,
    });

    if (existingLinkedDriver) {
      throw new Error("User is already linked to a driver");
    }
  }

  const driver = await Driver.create({
    userId,
    name,
    licenseNumber: normalizedLicenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    safetyScore,
    status: status || "AVAILABLE",
  });

  return normalizeDriver(driver);
};

const getDrivers = async (filters = {}) => {
  const { status, eligible } = filters;

  validateStatus(status);

  if (
    eligible !== undefined &&
    eligible !== "true" &&
    eligible !== "false"
  ) {
    throw new Error("Invalid eligible filter");
  }

  const query = {};

  if (status !== undefined) {
    query.status = status;
  }

  if (eligible === "true") {
    query.status = "AVAILABLE";
    query.licenseExpiryDate = {
      $gte: new Date(),
    };
  }

  const drivers = await Driver.find(query).sort({
    name: 1,
  });

  return drivers.map(normalizeDriver);
};

const getDriverById = async (id) => {
  validateDriverId(id);

  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  return normalizeDriver(driver);
};

const updateDriver = async (id, updateData) => {
  validateDriverId(id);

  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  validateStatus(updateData.status);
  validateDate(updateData.licenseExpiryDate);

  const allowedFields = [
    "userId",
    "name",
    "licenseNumber",
    "licenseCategory",
    "licenseExpiryDate",
    "contactNumber",
    "safetyScore",
    "status",
  ];

  const update = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      update[field] = updateData[field];
    }
  }

  if (update.userId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(update.userId)) {
      throw new Error("Invalid user ID");
    }

    const existingLinkedDriver = await Driver.findOne({
      userId: update.userId,
      _id: { $ne: id },
    });

    if (existingLinkedDriver) {
      throw new Error("User is already linked to a driver");
    }

    const user = await User.findById(update.userId);

    if (!user) {
      throw new Error("User not found");
    }
  }

  if (update.licenseNumber !== undefined) {
    const normalizedLicenseNumber =
      update.licenseNumber.trim();

    const existingLicense = await Driver.findOne({
      licenseNumber: normalizedLicenseNumber,
      _id: { $ne: id },
    });

    if (existingLicense) {
      throw new Error("Duplicate license number");
    }

    update.licenseNumber = normalizedLicenseNumber;
  }

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    update,
    {
      new: true,
      runValidators: true,
    }
  );

  return normalizeDriver(updatedDriver);
};

const deleteDriver = async (id) => {
  validateDriverId(id);

  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  const tripExists = await Trip.exists({
    driverId: id,
  });

  if (tripExists) {
    throw new Error(
      "Driver has trip records and cannot be deleted"
    );
  }

  await Driver.findByIdAndDelete(id);

  return {
    message: "Driver deleted successfully",
  };
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
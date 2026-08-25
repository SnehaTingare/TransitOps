const express = require("express");

const {
  createFuelLog,
  getFuelLogs,
} = require("../controllers/fuelController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Fuel Log
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  createFuelLog
);

// List Fuel Logs
router.get(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  getFuelLogs
);

module.exports = router;
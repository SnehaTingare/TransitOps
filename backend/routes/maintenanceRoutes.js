const express = require("express");

const {
  createMaintenance,
  getMaintenanceRecords,
  closeMaintenance,
} = require("../controllers/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Maintenance Record
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  createMaintenance
);

// List Maintenance Records
router.get(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  getMaintenanceRecords
);

// Close Maintenance
router.post(
  "/:id/close",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  closeMaintenance
);

module.exports = router;
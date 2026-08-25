const express = require("express");

const {
  getVehicleAnalytics,
  exportCsv,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Vehicle Analytics
router.get(
  "/vehicles",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  getVehicleAnalytics
);

// CSV Export
router.get(
  "/export/csv",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  exportCsv
);

module.exports = router;
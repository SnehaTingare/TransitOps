const express = require("express");

const {
  getDashboardKPIs,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Dashboard KPIs
// Accessible by all authenticated MVP roles
router.get(
  "/kpis",
  authMiddleware,
  roleMiddleware(
    "FLEET_MANAGER",
    "DRIVER",
    "SAFETY_OFFICER",
    "FINANCIAL_ANALYST"
  ),
  getDashboardKPIs
);

module.exports = router;
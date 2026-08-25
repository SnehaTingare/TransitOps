const express = require("express");

const {
  createDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "SAFETY_OFFICER"),
  createDriver
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "FLEET_MANAGER",
    "DRIVER",
    "SAFETY_OFFICER",
    "FINANCIAL_ANALYST"
  ),
  getDrivers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "FLEET_MANAGER",
    "DRIVER",
    "SAFETY_OFFICER",
    "FINANCIAL_ANALYST"
  ),
  getDriver
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "SAFETY_OFFICER"),
  updateDriver
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  deleteDriver
);

module.exports = router;
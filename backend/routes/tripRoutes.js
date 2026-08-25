const express = require("express");

const {
  createTrip,
  getTrips,
  getTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Trip
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  createTrip
);

// List Trips
router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "FLEET_MANAGER",
    "DRIVER",
    "SAFETY_OFFICER",
    "FINANCIAL_ANALYST"
  ),
  getTrips
);

// Get Trip
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "FLEET_MANAGER",
    "DRIVER",
    "SAFETY_OFFICER",
    "FINANCIAL_ANALYST"
  ),
  getTrip
);

// Dispatch Trip
router.post(
  "/:id/dispatch",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  dispatchTrip
);

// Complete Trip
router.post(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  completeTrip
);

// Cancel Trip
router.post(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  cancelTrip
);

module.exports = router;
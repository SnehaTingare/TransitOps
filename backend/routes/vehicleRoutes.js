const express = require("express");

const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  createVehicle
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
  getVehicles
);

router.get(
  "/:id",
  authMiddleware,
  getVehicle
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  updateVehicle
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER"),
  deleteVehicle
);

module.exports = router;
const express = require("express");

const {
  createExpense,
  getExpenses,
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Expense
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  createExpense
);

// List Expenses
router.get(
  "/",
  authMiddleware,
  roleMiddleware("FLEET_MANAGER", "FINANCIAL_ANALYST"),
  getExpenses
);

module.exports = router;
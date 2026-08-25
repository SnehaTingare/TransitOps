const expenseService = require("../services/expenseService");

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.body);

    return res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid expense type" ||
      error.message === "Invalid expense amount" ||
      error.message === "Date is required" ||
      error.message === "Invalid date" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses(
      req.query
    );

    return res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    if (
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid expense type" ||
      error.message === "From date is required" ||
      error.message === "Invalid from date" ||
      error.message === "To date is required" ||
      error.message === "Invalid to date"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
};
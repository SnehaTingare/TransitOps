const mongoose = require("mongoose");

const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");

const EXPENSE_TYPES = ["TOLL", "OTHER"];

const normalizeExpense = (expense) => ({
  id: expense._id,
  vehicleId: expense.vehicleId,
  type: expense.type,
  amount: expense.amount,
  date: expense.date,
  description:
    expense.description !== undefined
      ? expense.description
      : null,
});

const validateVehicleId = (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new Error("Invalid vehicle ID");
  }
};

const validateDate = (date, fieldName = "date") => {
  if (date === undefined || date === null) {
    throw new Error(`${fieldName} is required`);
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const validateExpenseType = (type) => {
  if (!EXPENSE_TYPES.includes(type)) {
    throw new Error("Invalid expense type");
  }
};

const createExpense = async (expenseData) => {
  const {
    vehicleId,
    type,
    amount,
    date,
    description,
  } = expenseData;

  validateVehicleId(vehicleId);
  validateExpenseType(type);
  validateDate(date);

  if (
    amount === undefined ||
    amount === null ||
    Number.isNaN(Number(amount)) ||
    Number(amount) < 0
  ) {
    throw new Error("Invalid expense amount");
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const expense = await Expense.create({
    vehicleId,
    type,
    amount,
    date,
    description,
  });

  return normalizeExpense(expense);
};

const getExpenses = async (filters = {}) => {
  const {
    vehicleId,
    type,
    from,
    to,
  } = filters;

  const query = {};

  if (vehicleId !== undefined) {
    validateVehicleId(vehicleId);
    query.vehicleId = vehicleId;
  }

  if (type !== undefined) {
    validateExpenseType(type);
    query.type = type;
  }

  if (from !== undefined) {
    validateDate(from, "from date");

    query.date = {
      ...query.date,
      $gte: new Date(from),
    };
  }

  if (to !== undefined) {
    validateDate(to, "to date");

    query.date = {
      ...query.date,
      $lte: new Date(to),
    };
  }

  const expenses = await Expense.find(query).sort({
    date: -1,
  });

  return expenses.map(normalizeExpense);
};

module.exports = {
  createExpense,
  getExpenses,
};
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Vehicle is required"],
    ref: "Vehicle",
  },

  type: {
    type: String,
    required: [true, "Expense type is required"],
    enum: {
      values: ["TOLL", "OTHER"],
      message: "Invalid expense type",
    },
  },

  amount: {
    type: Number,
    required: [true, "Expense amount is required"],
    min: [0, "Expense amount cannot be negative"],
  },

  date: {
    type: Date,
    required: [true, "Expense date is required"],
  },

  description: {
    type: String,
    trim: true,
  },
});

expenseSchema.index({
  vehicleId: 1,
  date: 1,
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
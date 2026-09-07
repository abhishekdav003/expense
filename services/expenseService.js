const Expense = require("../models/expenseModel");

const addExpense = async (amount, description, category, note, userId) => {
  const expense = await Expense.create({
    amount,
    description,
    category,
    note,
    user_id: userId,
  });

  return expense;
};

const getExpense = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Expense.findAndCountAll({
    where: {
      user_id: userId,
    },
    order: [["id", "DESC"]],
    limit,
    offset,
  });

  return {
    expenses: rows,
    totalExpenses: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const deleteExpense = async (expenseId, userId) => {
  const expense = await Expense.findOne({
    where: {
      id: expenseId,
      user_id: userId,
    },
  });

  if (!expense) {
    throw new Error("Expense not found");
  }

  await expense.destroy();
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
};

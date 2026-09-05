const { Op } = require("sequelize");

const Expense = require("../models/expenseModel");
const Income = require("../models/incomeModel");

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter = "monthly" } = req.query;

    let startDate = new Date();

    if (filter === "daily") {
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid filter",
      });
    }

    const expenses = await Expense.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const incomes = await Income.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const totalExpense = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );

    const totalIncome = incomes.reduce(
      (total, income) => total + Number(income.amount),
      0,
    );

    const savings = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      data: {
        expenses,
        incomes,
        totalIncome,
        totalExpense,
        savings,
      },
    });
  } catch (error) {
    console.error("Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
};

module.exports = {
  getReport,
};

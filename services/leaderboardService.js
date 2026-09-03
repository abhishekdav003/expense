const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const { fn, col } = require("sequelize");

const getLeaderboard = async () => {
  const leaderboard = await User.findAll({
    attributes: [
      "id",
      "name",

      [fn("COALESCE", fn("SUM", col("Expenses.amount")), 0), "totalExpense"],
    ],

    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],

    group: ["User.id"],

    order: [[fn("COALESCE", fn("SUM", col("Expenses.amount")), 0), "DESC"]],
  });

  return leaderboard;
};

module.exports = {
  getLeaderboard,
};

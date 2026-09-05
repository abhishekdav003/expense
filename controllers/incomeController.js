const Income = require("../models/incomeModel");

const addIncome = async (req, res) => {
  try {
    const { amount, description, source } = req.body;
    const userId = req.user.id;

    if (!amount || !description || !source) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const income = await Income.create({
      amount,
      description,
      source,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: income,
    });
  } catch (error) {
    console.error("Add Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add income",
    });
  }
};

const getIncomes = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomes = await Income.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: incomes,
    });
  } catch (error) {
    console.error("Get Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch incomes",
    });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { incomeId } = req.params;

    const income = await Income.findOne({
      where: {
        id: incomeId,
        userId,
      },
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    await income.destroy();

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Delete Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete income",
    });
  }
};

module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
};

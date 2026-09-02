const Expense = require("../models/expenseModel")

const addExpense = async(
  amount,
  description,
  category,
  userId
) => {
  const expense = await Expense.create({
    amount,
    description,
    category,
    user_id:userId
  })

  return expense
}

const getExpense = async (userId) => {
  const expense = await Expense.findAll({
    where: {
      user_id:userId
    },
    order: [
      ["id","DESC"]
    ]
  })
  return expense
}

const deleteExpense = async(
  expenseId,
  userId
) => {
  const expense = await Expense.findOne({
    where: {
      id: expenseId,
      user_id:userId
    }
  })
  if (!expense) {
    throw new Error("Expense not found")
  }
  await expense.destroy()
}

module.exports = {
  addExpense,
  getExpense,
  deleteExpense
}
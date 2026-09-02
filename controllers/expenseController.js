const expenseService = require("../services/expenseService")

const addExpense = async (req, res) => {
  try {
    const {
      amount,
      description,
      category
    } = req.body
    
    if (!amount || !description || !category) {
      return res.status(400).json({
        success: false,
        message:"All field are required"
      })
    }
    const expense = await expenseService.addExpense(
      amount, description,
      category,
      req.user.id
    )
    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data:expense
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message:error.message
    }

    )
  }
}

const getExpense = async (req, res) => {
  try {
    const expense = await expenseService.getExpense(
      req.user.id
    )

    res.status(200).json({
      success: true,
      data:expense
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message:error.message
    })
  }
}

const deleteExpense = async (req, res) => {
  try {
    const {expenseId} = req.params

    await expenseService.deleteExpense(
      expenseId,
      req.user.id
    )
    res.status(200).json({
      success: true,
      
      message:"Expense deleted sucessfully"
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:error.message
    })
  }
}

module.exports = {
  addExpense,
  getExpense,
  deleteExpense
}
const expenseService = require("../services/expenseService")
const s3ExpenseService = require("../services/s3ExpenseService");
const ExpenseDownload = require("../models/expenseDownloadModel");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category, note } = req.body;
    
    if (!amount || !description || !category) {
      return res.status(400).json({
        success: false,
        message:"All field are required"
      })
    }
    const expense = await expenseService.addExpense(
      amount,
      description,
      category,
      note,
      req.user.id,
    );
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
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (page < 1) page = 1;

    const allowedLimits = [5, 10, 20, 25, 50];

    if (!allowedLimits.includes(limit)) {
      limit = 10;
    }

    const result = await expenseService.getExpense(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.expenses,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalExpenses: result.totalExpenses,
        limit,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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

const downloadExpenses = async (req, res) => {
  try {
    const result = await s3ExpenseService.downloadExpenses(req.user.id);

    res.status(200).json({
      success: true,
      message: "Expense file generated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDownloadHistory = async (req, res) => {
  try {
    const downloads = await ExpenseDownload.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: downloads,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOldDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await ExpenseDownload.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download file not found",
      });
    }

    const url = await s3ExpenseService.getOldDownloadUrl(
      req.user.id,
      download.fileKey,
    );

    res.status(200).json({
      success: true,
      data: {
        url,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  downloadExpenses,
  getDownloadHistory,
  getOldDownloadUrl,
};
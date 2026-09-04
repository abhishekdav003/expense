const { suggestCategory } = require("../services/geminiService");

const suggestExpenseCategory = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Expense description is required",
      });
    }

    const category = await suggestCategory(description);

    res.status(200).json({
      success: true,
      category: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  suggestExpenseCategory,
};

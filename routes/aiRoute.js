const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const aiController = require("../controllers/aiController");

router.post(
  "/suggest-category",
  authenticateUser,
  aiController.suggestExpenseCategory,
);

module.exports = router;

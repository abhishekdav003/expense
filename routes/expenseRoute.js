const express = require("express")
const router = express.Router()

const expenseController = require("../controllers/expenseController")

const authenticateUser = require("../middleware/authMiddleware")
const premiumMiddleware = require("../middleware/premiumMiddleware");

router.post("/", authenticateUser, expenseController.addExpense)

router.get("/", authenticateUser, expenseController.getExpense)

router.get(
  "/download",
  authenticateUser,
  premiumMiddleware,
  expenseController.downloadExpenses,
);

router.get(
  "/download/history",
  authenticateUser,
  premiumMiddleware,
  expenseController.getDownloadHistory,
);

router.get(
  "/download/history/:id",
  authenticateUser,
  premiumMiddleware,
  expenseController.getOldDownloadUrl,
);

router.delete("/:expenseId", authenticateUser, expenseController.deleteExpense)

module.exports = router
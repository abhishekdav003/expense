const express = require("express")
const router = express.Router()

const expenseController = require("../controllers/expenseController")

const authenticateUser = require("../middleware/authMiddleware")

router.post("/", authenticateUser, expenseController.addExpense)

router.get("/", authenticateUser, expenseController.getExpense)

router.delete("/:expenseId", authenticateUser, expenseController.deleteExpense)

module.exports = router
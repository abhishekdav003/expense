const express = require("express");
const router = express.Router();

const {
  addIncome,
  getIncomes,
  deleteIncome,
} = require("../controllers/incomeController");

const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, addIncome);

router.get("/", authenticate, getIncomes);

router.delete("/:incomeId", authenticate, deleteIncome);

module.exports = router;
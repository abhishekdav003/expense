const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const premiumUser = require("../middleware/premiumMiddleware");
const { getReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/", authenticateUser, premiumUser, getReport);

module.exports = router;

const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const orderController = require("../controllers/orderController");

router.post("/create", authenticateUser, orderController.createOrder);

router.get("/verify/:orderId", authenticateUser, orderController.verifyPayment);

module.exports = router;

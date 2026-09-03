const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await orderService.createOrder(userId);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await orderService.verifyPayment(orderId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};

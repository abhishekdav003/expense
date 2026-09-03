const Order = require("../models/orderModel");
const User = require("../models/userModel");
const cashfree = require("../config/cashfree");

const createOrder = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const orderId = `order_${Date.now()}`;

  const amount = 100;

  const request = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",

    customer_details: {
      customer_id: `user_${user.id}`,
      customer_email: user.email,
      customer_phone: "9999999999",
    },
  };

  try {
    const response = await cashfree.PGCreateOrder(request);

    const paymentSessionId = response.data.payment_session_id;

    const order = await Order.create({
      orderId,
      userId,
      amount,
      currency: "INR",
      status: "PENDING",
      paymentSessionId,
    });

    return {
      order,
      paymentSessionId,
    };
  } catch (error) {
    console.error("Cashfree Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message || "Failed to create Cashfree order",
    );
  }
};

const verifyPayment = async (orderId) => {
  try {
    const response = await cashfree.PGFetchOrder(orderId);

    const paymentStatus = response.data.order_status;

    const order = await Order.findOne({
      where: {
        orderId: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (paymentStatus === "PAID") {
      await order.update({
        status: "PAID",
      });

      await User.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: order.userId,
          },
        },
      );

      return {
        paymentStatus: "PAID",
        message: "Payment successful. User is now Premium.",
      };
    }

    return {
      paymentStatus: paymentStatus,
      message: "Payment is not completed yet",
    };
  } catch (error) {
    console.error(
      "Cashfree Verification Error:",
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.message || "Failed to verify payment",
    );
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
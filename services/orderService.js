const Order = require("../models/orderModel");
const User = require("../models/userModel");
const cashfree = require("../config/cashfree");

const sequelize = require("../config/db");

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
    // Verify payment with Cashfree first
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
      // Start database transaction
      const transaction = await sequelize.transaction();

      try {
        // Update order status
        await order.update(
          {
            status: "PAID",
          },
          {
            transaction,
          },
        );

        // Update user premium status
        await User.update(
          {
            isPremium: true,
          },
          {
            where: {
              id: order.userId,
            },
            transaction,
          },
        );

        // Everything successful → COMMIT
        await transaction.commit();

        return {
          paymentStatus: "PAID",
          message: "Payment successful. User is now Premium.",
        };
      } catch (error) {
        // Something failed → ROLLBACK
        await transaction.rollback();

        throw error;
      }
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
      error.response?.data?.message ||
        error.message ||
        "Failed to verify payment",
    );
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
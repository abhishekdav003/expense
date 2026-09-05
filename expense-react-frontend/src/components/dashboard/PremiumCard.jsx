import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import api from "../../services/api";

function PremiumCard({ isPremium, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBuyPremium = async () => {
    try {
      setLoading(true);
      setMessage("");

      // 1. Create order
      const response = await api.post("/order/create");

      const { order, paymentSessionId } = response.data.data;

      if (!order?.orderId || !paymentSessionId) {
        throw new Error("Invalid payment response from server");
      }

      // 2. Initialize Cashfree
      const cashfree = await load({
        mode: "sandbox",
      });

      // 3. Open checkout
      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      console.log("Cashfree checkout result:", result);

      // 4. Verify payment with backend
      const verifyResponse = await api.get(
        `/order/verify/${order.orderId}`,
      );

      const paymentStatus =
        verifyResponse.data.data.paymentStatus;

      if (paymentStatus === "PAID") {
        setMessage("Payment successful! You are now a Premium User.");

        // Refresh user profile
        if (onPaymentSuccess) {
          await onPaymentSuccess();
        }
      } else {
        setMessage(
          verifyResponse.data.data.message ||
            "Payment is not completed.",
        );
      }
    } catch (error) {
      console.error(
        "Payment Error:",
        error.response?.data || error.message,
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Payment failed",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="bg-green-50 border border-green-200 p-5 rounded-lg shadow">
        <p className="text-gray-500">
          Premium Membership
        </p>

        <h2 className="text-xl font-bold text-green-600 mt-2">
          You are a Premium User 
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Your premium membership is active.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow border">
      <p className="text-gray-500">
        Upgrade Your Account
      </p>

      <h2 className="text-xl font-bold mt-2">
        Become a Premium User
      </h2>

      <p className="text-gray-600 text-sm mt-2">
        Unlock premium features and access the leaderboard.
      </p>

      {message && (
        <p
          className={`text-sm mt-3 ${
            message.includes("successful")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <button
        onClick={handleBuyPremium}
        disabled={loading}
        className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Buy Premium ₹100"}
      </button>
    </div>
  );
}

export default PremiumCard;
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/password/forgotpassword",
        {
          email,
        },
      );

      setMessage(
        response.data.message ||
          "Password reset email sent successfully",
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center">
          Forgot Password?
        </h1>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Enter your email address and we'll send you a password reset link.
        </p>

        {message && (
          <p className="text-sm text-center mb-4 text-blue-600">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Remember your password?{" "}

          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
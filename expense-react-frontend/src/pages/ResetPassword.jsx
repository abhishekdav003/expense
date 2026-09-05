import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Check passwords
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/password/resetpassword/${token}`,
        {
          newPassword,
        },
      );

      setMessage(
        response.data.message ||
          "Password reset successfully",
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Enter your new password below.
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

          {/* New Password */}

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />


          {/* Confirm Password */}

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;
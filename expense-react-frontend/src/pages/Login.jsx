import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/user/login",
        formData
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      navigate("/dashboard");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

        <h1 className="text-2xl font-bold text-center mb-2">
          Expense Tracker
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to manage your expenses
        </p>

        {message && (
          <p className="mb-4 text-center text-red-500 text-sm">
            {message}
          </p>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
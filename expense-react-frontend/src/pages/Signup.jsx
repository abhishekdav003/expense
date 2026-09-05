import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/user/signup",
        formData
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        {message && (
          <p className="mb-4 text-center text-sm">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
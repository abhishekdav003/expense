import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

function AddExpenseForm({
  formData,
  handleChange,
  handleCategorySuggestion,
  handleSubmit,
  loading,
  message,
}) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const requestRef = useRef(0);

  useEffect(() => {
    const description = formData.description.trim();

    if (description.length < 3) {
      setAiLoading(false);
      setAiMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      const requestId = ++requestRef.current;

      try {
        setAiLoading(true);
        setAiMessage("");

        const response = await api.post("/ai/suggest-category", {
          description,
        });

        if (requestId !== requestRef.current) return;

        const category = response.data.category;

        handleCategorySuggestion(category);
        setAiMessage(`AI selected: ${category}`);
      } catch (error) {
        if (requestId === requestRef.current) {
          console.error(
            "AI Category Error:",
            error.response?.data || error.message,
          );
          setAiMessage("");
        }
      } finally {
        if (requestId === requestRef.current) {
          setAiLoading(false);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.description, handleCategorySuggestion]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      {message && (
        <p className="mb-4 text-sm text-blue-600">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {aiLoading && (
            <p className="text-xs text-blue-600 mt-1">
              AI is choosing category...
            </p>
          )}

          {aiMessage && !aiLoading && (
            <p className="text-xs text-green-600 mt-1">
              {aiMessage}
            </p>
          )}
        </div>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
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

  // Keeps track of the latest AI request
  const latestRequestRef = useRef(0);

  useEffect(() => {
    const description = formData.description.trim();

    // Stop AI request for short descriptions
    if (description.length < 3) {
      setAiMessage("");
      setAiLoading(false);
      return;
    }

    // Wait 800ms after user stops typing
    const timer = setTimeout(async () => {
      // Create a unique request ID
      const requestId = ++latestRequestRef.current;

      try {
        setAiLoading(true);
        setAiMessage("");

        // Call AI API
        const response = await api.post(
          "/ai/suggest-category",
          {
            description,
          },
        );

        // Ignore old AI responses
        if (requestId !== latestRequestRef.current) {
          return;
        }

        const suggestedCategory = response.data.category;

        // Automatically update category
        handleCategorySuggestion(suggestedCategory);

        setAiMessage(
          `AI selected: ${suggestedCategory}`,
        );
      } catch (error) {
        // Only show error for the latest request
        if (requestId === latestRequestRef.current) {
          console.error(
            "AI Category Error:",
            error.response?.data || error.message,
          );

          setAiMessage("");
        }
      } finally {
        // Only stop loading for the latest request
        if (requestId === latestRequestRef.current) {
          setAiLoading(false);
        }
      }
    }, 800);

    // Cancel timer when description changes
    return () => {
      clearTimeout(timer);
    };
  }, [formData.description, handleCategorySuggestion]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        Add Expense
      </h2>

      {/* Normal message */}
      {message && (
        <p className="mb-4 text-sm text-blue-600">
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Description */}
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

          {/* AI Loading */}
          {aiLoading && (
            <p className="text-xs text-blue-600 mt-1">
              🤖 AI is choosing category...
            </p>
          )}

          {/* AI Result */}
          {aiMessage && !aiLoading && (
            <p className="text-xs text-green-600 mt-1">
              🤖 {aiMessage}
            </p>
          )}
        </div>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">
            Select Category
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Petrol">
            Petrol
          </option>

          <option value="Salary">
            Salary
          </option>

          <option value="Shopping">
            Shopping
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading
            ? "Adding..."
            : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
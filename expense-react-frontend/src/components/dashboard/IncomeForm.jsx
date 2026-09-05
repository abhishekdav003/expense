import { useState } from "react";
import api from "../../services/api";

function IncomeForm({ onIncomeAdded }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await api.post("/income", {
        amount: Number(amount),
        description,
        source,
      });

      setMessage("Income added successfully");

      setAmount("");
      setDescription("");
      setSource("");

      if (onIncomeAdded) {
        onIncomeAdded();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add income",
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        Add Income
      </h2>

      {message && (
        <p className="text-sm mb-4 text-blue-600">
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Add Income
        </button>
      </form>
    </div>
  );
}

export default IncomeForm;
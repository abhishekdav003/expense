import { useEffect, useState } from "react";
import api from "../../services/api";

function PremiumReport({ isPremium }) {
  const [filter, setFilter] = useState("monthly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchReport = async (selectedFilter = filter) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        `/report?filter=${selectedFilter}`,
      );

      setReport(response.data.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch report",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium) {
      fetchReport();
    }
  }, [isPremium, filter]);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const downloadReport = () => {
    if (!report) return;

    const rows = [];

    rows.push(["Type", "Description", "Category/Source", "Amount", "Date"]);

    report.incomes.forEach((income) => {
      rows.push([
        "Income",
        income.description,
        income.source,
        income.amount,
        new Date(income.createdAt).toLocaleDateString(),
      ]);
    });

    report.expenses.forEach((expense) => {
      rows.push([
        "Expense",
        expense.description,
        expense.category,
        expense.amount,
        new Date(expense.createdAt).toLocaleDateString(),
      ]);
    });

    rows.push([]);
    rows.push(["Total Income", "", "", report.totalIncome, ""]);
    rows.push(["Total Expense", "", "", report.totalExpense, ""]);
    rows.push(["Savings", "", "", report.savings, ""]);

    const csvContent = rows
      .map((row) =>
        row.map((item) => `"${item ?? ""}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filter}-expense-report.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (!isPremium) {
    return (
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold">
          Expense Report
        </h2>

        <p className="text-gray-500 mt-2">
          Upgrade to Premium to view detailed reports and download your data.
        </p>

        <button
          disabled
          className="mt-4 bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
        >
          Download Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            Expense Report
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View your income and expenses.
          </p>
        </div>

        <button
          onClick={downloadReport}
          disabled={!report || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Download Report
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleFilterChange("daily")}
          className={`px-4 py-2 rounded ${
            filter === "daily"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Daily
        </button>

        <button
          onClick={() => handleFilterChange("weekly")}
          className={`px-4 py-2 rounded ${
            filter === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Weekly
        </button>

        <button
          onClick={() => handleFilterChange("monthly")}
          className={`px-4 py-2 rounded ${
            filter === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Monthly
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-gray-500">
          Loading report...
        </p>
      )}

      {message && (
        <p className="mt-6 text-red-500">
          {message}
        </p>
      )}

      {report && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <p className="text-gray-500 text-sm">
                Total Income
              </p>

              <h3 className="text-xl font-bold mt-1">
                ₹{Number(report.totalIncome).toFixed(2)}
              </h3>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-gray-500 text-sm">
                Total Expense
              </p>

              <h3 className="text-xl font-bold mt-1">
                ₹{Number(report.totalExpense).toFixed(2)}
              </h3>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-gray-500 text-sm">
                Savings
              </p>

              <h3 className="text-xl font-bold mt-1">
                ₹{Number(report.savings).toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">
              Income
            </h3>

            {report.incomes.length === 0 ? (
              <p className="text-gray-500">
                No income found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Source</th>
                      <th className="p-3 text-left">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.incomes.map((income) => (
                      <tr
                        key={income.id}
                        className="border-b"
                      >
                        <td className="p-3">
                          {new Date(
                            income.createdAt,
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          {income.description}
                        </td>

                        <td className="p-3">
                          {income.source}
                        </td>

                        <td className="p-3">
                          ₹{Number(income.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">
              Expenses
            </h3>

            {report.expenses.length === 0 ? (
              <p className="text-gray-500">
                No expenses found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b"
                      >
                        <td className="p-3">
                          {new Date(
                            expense.createdAt,
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          {expense.description}
                        </td>

                        <td className="p-3">
                          {expense.category}
                        </td>

                        <td className="p-3">
                          ₹{Number(expense.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PremiumReport;
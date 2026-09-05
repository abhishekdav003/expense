function StatsCards({
  totalExpense,
  totalEntries,
  isPremium,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      {/* Total Expense */}
      <div className="bg-white p-5 rounded-lg shadow">
        <p className="text-gray-500">
          Total Expenses
        </p>

        <h2 className="text-2xl font-bold mt-2">
          ₹{totalExpense}
        </h2>
      </div>

      {/* Total Entries */}
      <div className="bg-white p-5 rounded-lg shadow">
        <p className="text-gray-500">
          Total Entries
        </p>

        <h2 className="text-2xl font-bold mt-2">
          {totalEntries}
        </h2>
      </div>

      {/* Premium Status */}
      <div className="bg-white p-5 rounded-lg shadow">
        <p className="text-gray-500">
          Premium Status
        </p>

        <h2
          className={`text-lg font-bold mt-2 ${
            isPremium
              ? "text-green-600"
              : "text-gray-700"
          }`}
        >
          {isPremium
            ? "Premium User"
            : "Free User"}
        </h2>
      </div>

    </div>
  );
}

export default StatsCards;
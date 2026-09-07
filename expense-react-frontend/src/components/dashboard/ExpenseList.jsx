function ExpenseList({
  expenses,
  onDelete,
  currentPage,
  totalPages,
  totalExpenses,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const startExpense =
    totalExpenses === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endExpense = Math.min(
    currentPage * limit,
    totalExpenses,
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Expenses</h2>

        <p className="text-sm text-gray-500">
          Total: {totalExpenses}
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="p-3">
                      {expense.description}
                    </td>

                    <td className="p-3">
                      {expense.category}
                    </td>

                    <td className="p-3">
                      ₹{Number(expense.amount).toFixed(2)}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Rows per page:
              </span>

              <select
                value={limit}
                onChange={(e) =>
                  onLimitChange(Number(e.target.value))
                }
                className="border rounded px-3 py-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {startExpense}-{endExpense} of {totalExpenses}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    onPageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    onPageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;
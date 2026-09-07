function ExpenseList({
  expenses,
  onDelete,
  currentPage,
  totalPages,
  totalExpenses,
  onPageChange,
}) {
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
                    <td className="p-3">{expense.description}</td>

                    <td className="p-3">{expense.category}</td>

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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseList;
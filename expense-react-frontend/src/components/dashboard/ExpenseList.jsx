function ExpenseList({
  expenses,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">

      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          Your Expenses
        </h2>
      </div>

      {expenses.length === 0 ? (

        <p className="p-6 text-gray-500">
          No expenses added yet.
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>

                <th className="text-left p-4">
                  Amount
                </th>

                <th className="text-left p-4">
                  Description
                </th>

                <th className="text-left p-4">
                  Category
                </th>

                <th className="text-left p-4">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {expenses.map((expense) => (

                <tr
                  key={expense.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    ₹{expense.amount}
                  </td>

                  <td className="p-4">
                    {expense.description}
                  </td>

                  <td className="p-4">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {expense.category}
                    </span>

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        onDelete(expense.id)
                      }
                      className="text-red-600 hover:text-red-800 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default ExpenseList;
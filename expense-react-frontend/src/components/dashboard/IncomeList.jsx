function IncomeList({ incomes, onDelete }) {
  if (!incomes || incomes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Income</h2>

        <p className="text-gray-500">
          No income added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Your Income
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Description</th>
              <th className="p-3">Source</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {incomes.map((income) => (
              <tr
                key={income.id}
                className="border-b"
              >
                <td className="p-3">
                  {income.description}
                </td>

                <td className="p-3">
                  {income.source}
                </td>

                <td className="p-3">
                  ₹{Number(income.amount).toFixed(2)}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => onDelete(income.id)}
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
    </div>
  );
}

export default IncomeList;
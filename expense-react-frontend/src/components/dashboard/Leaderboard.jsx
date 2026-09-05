function Leaderboard({ leaderboard, loading, onClose }) {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h2 className="text-xl font-bold">
            Leaderboard
          </h2>

          <p className="text-sm text-gray-500">
            Users ranked by total expenses
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600"
        >
          Close
        </button>
      </div>

      {loading && (
        <p className="p-6 text-gray-500">
          Loading leaderboard...
        </p>
      )}

      {!loading && leaderboard.length === 0 && (
        <p className="p-6 text-gray-500">
          No leaderboard data available.
        </p>
      )}

      {!loading && leaderboard.length > 0 && (
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Rank</th>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">
                Total Expense
              </th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {index + 1}
                </td>

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  ₹{Number(user.totalExpense || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
function DashboardNavbar({
  userName,
  onLogout,
  isPremium,
  onShowLeaderboard,
}) {
  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">
            Expense Tracker
          </h1>

          <p className="text-sm text-blue-100">
            Welcome, {userName || "User"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isPremium && (
            <button
              onClick={onShowLeaderboard}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-medium"
            >
              Leaderboard
            </button>
          )}

          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
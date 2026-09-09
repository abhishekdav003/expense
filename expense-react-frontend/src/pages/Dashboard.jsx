import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import AddExpenseForm from "../components/dashboard/AddExpenseForm";
import ExpenseList from "../components/dashboard/ExpenseList";
import PremiumCard from "../components/dashboard/PremiumCard";
import Leaderboard from "../components/dashboard/Leaderboard";
import IncomeForm from "../components/dashboard/IncomeForm";
import IncomeList from "../components/dashboard/IncomeList";
import PremiumReport from "../components/dashboard/PremiumReport";
import DownloadHistory from "../components/DownloadHistory";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [profile, setProfile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [limit, setLimit] = useState(() => {
    const savedLimit = Number(localStorage.getItem("expenseLimit"));

    return [5, 10, 20, 25, 50].includes(savedLimit)
      ? savedLimit
      : 10;
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalExpenses: 0,
  });

 const [formData, setFormData] = useState({
  amount: "",
  description: "",
  category: "",
  note: "",
});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] =
    useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setProfile(response.data.data);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Failed to fetch user profile",
      );
    }
  };

  const fetchExpenses = async (
    page = 1,
    selectedLimit = limit,
  ) => {
    try {
      const response = await api.get(
        `/expense?page=${page}&limit=${selectedLimit}`,
      );

      const data = response.data;

      setExpenses(data.data || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalExpenses: 0,
        },
      );

      setCurrentPage(data.pagination?.currentPage || page);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Failed to fetch expenses",
      );
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await api.get("/income");
      setIncomes(response.data.data || []);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Failed to fetch incomes",
      );
    }
  };

  useEffect(() => {
    fetchExpenses(1, limit);
    fetchIncomes();
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySuggestion = (category) => {
    setFormData({
      ...formData,
      category,
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/expense", {
  amount: Number(formData.amount),
  description: formData.description,
  category: formData.category,
  note: formData.note,
});

      setMessage(response.data.message);

      setFormData({
  amount: "",
  description: "",
  category: "",
  note: "",
});

      await fetchExpenses(1);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add expense",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    localStorage.setItem("expenseLimit", newLimit);

    fetchExpenses(1, newLimit);
  };

  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expense/${expenseId}`);

      const pageToLoad =
        expenses.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      await fetchExpenses(pageToLoad);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete expense",
      );
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await api.delete(`/income/${incomeId}`);
      fetchIncomes();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete income",
      );
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);

      const response = await api.get("/leaderboard");

      setLeaderboard(response.data.data || []);
      setShowLeaderboard(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch leaderboard",
      );
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const totalExpense = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const handleDownloadExpenses = async () => {
  try {
    const response = await api.get("/expense/download");

    const url = response.data.data.url;

    window.open(url, "_blank");
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        "Failed to download expenses"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar
        userName={profile?.name}
        onLogout={handleLogout}
        isPremium={profile?.isPremium}
        onShowLeaderboard={fetchLeaderboard}
      />

      <main className="max-w-6xl mx-auto p-6">
        {showLeaderboard && (
          <Leaderboard
            leaderboard={leaderboard}
            loading={leaderboardLoading}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        <StatsCards
          totalExpense={totalExpense}
          totalEntries={pagination.totalExpenses}
          isPremium={profile?.isPremium}
        />

        <div className="mb-6">
          <PremiumCard
            isPremium={profile?.isPremium}
            onPaymentSuccess={fetchUserProfile}
          />
        </div>

        <PremiumReport isPremium={profile?.isPremium} />

       {profile?.isPremium && (
  <>
    <DownloadHistory />

    <button
      onClick={handleDownloadExpenses}
      className="mb-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Download All Expenses
    </button>
  </>
)}

        <AddExpenseForm
          formData={formData}
          handleChange={handleChange}
          handleCategorySuggestion={handleCategorySuggestion}
          handleSubmit={handleAddExpense}
          loading={loading}
          message={message}
        />

        <IncomeForm onIncomeAdded={fetchIncomes} />

        <IncomeList
          incomes={incomes}
          onDelete={handleDeleteIncome}
        />

        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalExpenses={pagination.totalExpenses}
          limit={limit}
          onPageChange={fetchExpenses}
          onLimitChange={handleLimitChange}
        />
      </main>
    </div>
  );
}

export default Dashboard;
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

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

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

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expense");
      setExpenses(response.data.data || []);
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
    fetchExpenses();
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
      });

      setMessage(response.data.message);

      setFormData({
        amount: "",
        description: "",
        category: "",
      });

      fetchExpenses();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add expense",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expense/${expenseId}`);
      fetchExpenses();
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
          totalEntries={expenses.length}
          isPremium={profile?.isPremium}
        />

        <div className="mb-6">
          <PremiumCard
            isPremium={profile?.isPremium}
            onPaymentSuccess={fetchUserProfile}
          />
         
        </div>

         <PremiumReport isPremium={profile?.isPremium} />

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
        />
        
      </main>
    </div>
  );
}

export default Dashboard;
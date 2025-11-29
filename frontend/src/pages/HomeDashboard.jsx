import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Users, FileQuestion, ClipboardList, BarChart3, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const HomeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (user?.role === "admin") getAdminStats();
    else if (user?.role === "student") getStudentStats();
  }, [user]);

  // 🧑‍💼 ADMIN STATS
  const getAdminStats = async () => {
    try {
      const [qRes, tRes, rRes, uRes] = await Promise.all([
        axios.get("http://localhost:5000/api/questions"),
        axios.get("http://localhost:5000/api/tests"),
        axios.get("http://localhost:5000/api/results/test/" + "dummy"),
        axios.get("http://localhost:5000/api/auth/all")
      ]);

      setStats({
        totalQuestions: qRes.data.length,
        totalTests: tRes.data.length,
        totalUsers: uRes.data.length || 0,
        totalResults: rRes.data.length || 0,
      });
    } catch (error) {
      console.log("Error fetching admin stats:", error.message);
    }
  };

  // 🎓 STUDENT STATS
  const getStudentStats = async () => {
    try {
      const [testsRes, resultsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tests"),
        axios.get(`http://localhost:5000/api/results/student/${user._id}`)
      ]);

      const attempted = resultsRes.data.length;

      // Convert each result score→percentage
      const percentages = resultsRes.data.map(r => {
        return ((r.score / r.totalQuestions) * 100);
      });

      // AVERAGE %
      const avgPercentage =
        attempted > 0
          ? (percentages.reduce((sum, p) => sum + p, 0) / attempted).toFixed(1)
          : 0;

      // BEST %
      const bestPercentage =
        attempted > 0
          ? Math.max(...percentages).toFixed(1)
          : 0;

      setStats({
        totalTests: testsRes.data.length,
        attempted,
        avgScore: avgPercentage,     // already %
        bestScore: bestPercentage,   // already %
      });
    } catch (error) {
      console.log("Error fetching student stats:", error.message);
    }
  };

  return (
    <div className="p-6 mt-8">
      <BackButton />

      <h2 className="text-3xl text-blue-600 font-bold text-center mb-6">
        Welcome {user?.name || "User"} 👋
      </h2>

      {/* --- ADMIN DASHBOARD --- */}
      {user?.role === "admin" && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <h1 className="text-3xl font-bold">{stats.totalQuestions}</h1>
              </div>
              <FileQuestion size={32} className="text-blue-600" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <h1 className="text-3xl font-bold">{stats.totalTests}</h1>
              </div>
              <ClipboardList size={32} className="text-green-600" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Registered Users</p>
                <h1 className="text-3xl font-bold">{stats.totalUsers}</h1>
              </div>
              <Users size={32} className="text-purple-600" />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <Link to="/admin" className="p-6 bg-blue-50 hover:bg-blue-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-blue-700">➕ Manage/Add Questions</h3>
              <p className="text-sm text-gray-600 mt-2">Add or delete aptitude questions</p>
            </Link>

            <Link to="/admin/create-test" className="p-6 bg-green-50 hover:bg-green-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-green-700">🧾 Create Test</h3>
              <p className="text-sm text-gray-600 mt-2">Assemble and schedule new tests</p>
            </Link>

            <Link to="/admin/manage-tests" className="p-6 bg-yellow-50 hover:bg-yellow-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-yellow-700">✏️ Edit Tests</h3>
              <p className="text-sm text-gray-600 mt-2">Modify test title & questions</p>
            </Link>

            <Link to="/admin/results" className="p-6 bg-purple-50 hover:bg-purple-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-purple-700">📊 View Analytics</h3>
              <p className="text-sm text-gray-600 mt-2">View results and charts</p>
            </Link>
          </div>
        </>
      )}

      {/* --- STUDENT DASHBOARD --- */}
      {user?.role === "student" && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <h1 className="text-3xl font-bold">{stats.totalTests}</h1>
              </div>
              <ClipboardList size={32} className="text-blue-600" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Attempted</p>
                <h1 className="text-3xl font-bold">{stats.attempted}</h1>
              </div>
              <BarChart3 size={32} className="text-green-600" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Average Score (%)</p>
                <h1 className="text-3xl font-bold">{stats.avgScore}%</h1>
              </div>
              <TrendingUp size={32} className="text-orange-600" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Best Score (%)</p>
                <h1 className="text-3xl font-bold">{stats.bestScore}%</h1>
              </div>
              <Award size={32} className="text-purple-600" />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Link to="/dashboard" className="p-6 bg-blue-50 hover:bg-blue-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-blue-700">🧩 Available Tests</h3>
              <p className="text-sm text-gray-600 mt-2">Start or retry aptitude tests</p>
            </Link>

            <Link to="/student/results" className="p-6 bg-green-50 hover:bg-green-100 text-center rounded-xl shadow transition">
              <h3 className="text-xl font-semibold text-green-700">📈 My Results</h3>
              <p className="text-sm text-gray-600 mt-2">Track your past performance</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeDashboard;

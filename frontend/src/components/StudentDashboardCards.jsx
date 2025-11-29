import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Award, ClipboardList, TrendingUp, Clock } from "lucide-react";

const StudentDashboardCards = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTests: 0,
    attempted: 0,
    averagePercentage: 0,
    bestPercentage: 0,
  });

  useEffect(() => {
    getStudentStats();
  }, [user]);

  const getStudentStats = async () => {
    if (!user?._id) return;

    try {
      const [testRes, resultRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tests"),
        axios.get(`http://localhost:5000/api/results/student/${user._id}`)
      ]);

      const allTests = testRes.data.length;
      const results = resultRes.data;

      const attempted = results.length;

      // ⭐ Calculate % (score/totalMarks * 100)
      const averagePercentage =
        attempted > 0
          ? (
              results.reduce(
                (sum, r) => sum + (r.score / r.totalMarks) * 100,
                0
              ) / attempted
            ).toFixed(1)
          : 0;

      const bestPercentage =
        attempted > 0
          ? Math.max(
              ...results.map((r) => ((r.score / r.totalMarks) * 100).toFixed(1))
            )
          : 0;

      setStats({
        totalTests: allTests,
        attempted,
        averagePercentage,
        bestPercentage,
      });

    } catch (error) {
      console.error("Error fetching student stats:", error.message);
    }
  };

  const cards = [
    { title: "Total Tests", value: stats.totalTests, icon: <ClipboardList size={32} className="text-blue-600" /> },
    { title: "Attempted Tests", value: stats.attempted, icon: <Clock size={32} className="text-orange-600" /> },
    { title: "Average %", value: `${stats.averagePercentage}%`, icon: <TrendingUp size={32} className="text-green-600" /> },
    { title: "Best %", value: `${stats.bestPercentage}%`, icon: <Award size={32} className="text-purple-600" /> },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-2xl shadow-md flex items-center justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
        >
          <div>
            <h3 className="text-gray-600 text-sm">{card.title}</h3>
            <h1 className="text-3xl font-bold text-gray-800">{card.value}</h1>
          </div>
          {card.icon}
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardCards;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, FileQuestion, Users, BarChart3 } from "lucide-react";

const AdminDashboardCards = () => {
  const [stats, setStats] = useState({
    questions: 0,
    tests: 0,
    users: 0,
    results: 0,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [qRes, tRes, rRes, uRes] = await Promise.all([
        axios.get("http://localhost:5000/api/questions"),
        axios.get("http://localhost:5000/api/tests"),
        axios.get("http://localhost:5000/api/results/test/" + "dummy"), // we'll handle below
        axios.get("http://localhost:5000/api/auth/all"), // optional
      ]);

      setStats({
        questions: qRes.data.length,
        tests: tRes.data.length,
        results: rRes.data.length || 0,
        users: uRes.data.length || 0,
      });
    } catch (error) {
      console.log("Error fetching dashboard stats:", error.message);
    }
  };

  const cards = [
    { title: "Total Questions", count: stats.questions, icon: <FileQuestion size={32} className="text-blue-600" /> },
    { title: "Total Tests", count: stats.tests, icon: <ClipboardList size={32} className="text-green-600" /> },
    { title: "Total Students", count: stats.users, icon: <Users size={32} className="text-purple-600" /> },
    
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition"
        >
          <div>
            <h3 className="text-gray-600 text-sm">{card.title}</h3>
            <h1 className="text-3xl font-bold text-gray-800">{card.count}</h1>
          </div>
          {card.icon}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardCards;

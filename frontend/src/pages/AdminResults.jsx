import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import BackButton from "../components/BackButton";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const AdminResults = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [testType, setTestType] = useState(""); // NEW DROPDOWN
  const [selectedTest, setSelectedTest] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    getCategorizedTests();
  }, []);

  // Get Available & Scheduled tests
  const getCategorizedTests = async () => {
    const res = await axios.get("http://localhost:5000/api/tests/categorized");
    setTests(res.data);
  };

  // Filter tests based on type dropdown
  useEffect(() => {
    if (testType === "Available") {
      setFilteredTests(tests.availableTests || []);
    } else if (testType === "Scheduled") {
      setFilteredTests(tests.scheduledTests || []);
    } else {
      setFilteredTests([]); // default when no type selected
    }
    setSelectedTest(""); // reset test selection
  }, [testType, tests]);

  // Fetch results
  const handleViewResults = async () => {
    if (!selectedTest) {
      alert("Please select a test first!");
      return;
    }
    const res = await axios.get(
      `http://localhost:5000/api/results/test/${selectedTest}`
    );
    setResults(res.data);
  };

  // === Chart Data ===
  const barData = {
    labels: results.map((r) => r.student?.name || "Unknown"),
    datasets: [
      {
        label: "Scores",
        data: results.map((r) => r.score),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };

  const avgCorrect =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.correctAnswers, 0) / results.length
      : 0;

  const avgWrong =
    results.length > 0
      ? results.reduce(
        (sum, r) => sum + (r.totalQuestions - r.correctAnswers),
        0
      ) / results.length
      : 0;

  const pieData = {
    labels: ["Average Correct", "Average Wrong"],
    datasets: [
      {
        data: [avgCorrect, avgWrong],
        backgroundColor: ["#3B82F6", "#F87171"],
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 mt-8">
      <BackButton />

      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Admin Results Analytics
      </h2>

      {/* Test Type Dropdown */}
      <div className="max-w-md mx-auto flex flex-col items-center mb-4">
        <select
          className="w-full border p-2 rounded mb-3"
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
        >
          <option value="">-- Select Test Type --</option>
          <option value="Available">Available Tests</option>
          <option value="Scheduled">Scheduled Tests</option>
        </select>
      </div>

      {/* Test Dropdown (Depends on selected type) */}
      {testType && (
        <div className="max-w-md mx-auto flex flex-col items-center mb-6">
          <select
            className="w-full border p-2 rounded mb-3"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="">-- Select Test --</option>

            {filteredTests.length === 0 && (
              <option disabled>No tests found</option>
            )}

            {filteredTests.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleViewResults}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            View Results
          </button>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-5xl mx-auto mb-10">
          <h3 className="text-xl font-semibold text-center mb-3">
            Result Summary
          </h3>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full border bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-center">Score</th>
                  <th className="p-2 text-center">Ranking</th>

                  <th className="p-2 text-center">Correct</th>
                  <th className="p-2 text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => (
                  <tr key={r._id} className="border-b hover:bg-gray-100">
                    <td className="p-2">{r.student?.name || "Unknown"}</td>
                    <td className="p-2 text-center font-semibold">
                      {((r.score / r.totalQuestions) * 100).toFixed(1)}%
                    </td>
                    <td className="p-2 text-center">
                      {r.score === 0
                        ? "No Ranking"
                        : r.rank === 1
                          ? "🏆 Rank 1"
                          : `Rank ${r.rank}`}
                    </td>


                    <td className="p-2 text-center">{r.correctAnswers}</td>
                    <td className="p-2 text-center">{r.totalQuestions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Scores by Student
            </h3>
            <div className="w-full h-64">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Average Performance
            </h3>
            <div className="w-full h-64 flex justify-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;

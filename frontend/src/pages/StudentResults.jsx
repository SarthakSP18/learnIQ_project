import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      getResults();
    }
  }, [user]);

  const getResults = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/results/student/${user._id}`
      );
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Helper function to find test type
  const getTestType = (test) => {
    if (!test) return "Unknown";

    if (test.scheduledFrom && test.scheduledTo) return "Scheduled Test";
    return "Available Test";
  };

  return (
    <div className="p-6 mt-8">
      <BackButton />

      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
        My Test Results
      </h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-600">
          No test results found yet.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <table className="w-full border shadow-md bg-white rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Test Title</th>
                <th className="p-2 text-center">Type</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">Correct</th>
                <th className="p-2 text-center">Total</th>
                <th className="p-2 text-center">Date</th>
                <th className="p-2 text-center">Details</th>

              </tr>
            </thead>

            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">
                    {r.test?.title || "Deleted Test"}
                  </td>

                  {/* Test Type Column */}
                  <td className="p-2 text-center font-medium">
                    {getTestType(r.test)}
                  </td>

                  <td className="p-2 text-center font-semibold">
                    {(() => {
                      const total = r.totalQuestions;
                      const correct = r.correctAnswers;

                      if (!total || total === 0) return "0%";

                      const percentage = Math.round((correct / total) * 100);
                      return percentage + "%";
                    })()}
                  </td>

                  <td className="p-2 text-center">
                    {r.correctAnswers}
                  </td>
                  <td className="p-2 text-center">
                    {r.totalQuestions}
                  </td>
                  <td className="p-2 text-center">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => navigate(`/results/${r._id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View
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
};

export default StudentResults;

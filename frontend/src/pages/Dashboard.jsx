import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import StudentDashboardCards from "../components/StudentDashboardCards";
import BackButton from "../components/BackButton";

const Dashboard = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const [scheduledTests, setScheduledTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTests();
  }, []);

  // Fetch categorized tests
  const getTests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tests/categorized");
      setAvailableTests(res.data.availableTests || []);
      setScheduledTests(res.data.scheduledTests || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  // Update timers and availability
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setAvailableTests((prev) =>
        prev.filter((test) => {
          const start = new Date(test.scheduledFrom);
          const end = new Date(test.scheduledTo);
          return (
            (!test.scheduledFrom && !test.scheduledTo) ||
            (now >= start && now <= end)
          );
        })
      );

      setScheduledTests((prev) =>
        prev.map((test) => {
          const start = new Date(test.scheduledFrom);
          const end = new Date(test.scheduledTo);
          const isAvailable = now >= start && now <= end;
          const isExpired = now > end;

          let countdown = "";
          if (!isAvailable && !isExpired) {
            const diff = start - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            countdown = `${hours}h ${minutes}m ${seconds}s`;
          }

          return { ...test, isAvailable, isExpired, countdown };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 mt-8">
      <BackButton />

      {/* Available Tests */}
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Available Tests
      </h2>

      {/* <StudentDashboardCards /> */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 mt-10">
        {availableTests.length > 0 ? (
          availableTests.map((test) => {
            const percentage =
              test.totalMarks
                ? ((test.obtainedMarks / test.totalMarks) * 100).toFixed(2)
                : null;

            return (
              <div
                key={test._id}
                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {test.title}
                </h3>

                {percentage !== null && (
                  <p className="text-gray-600 mb-2">
                    Score: <b>{percentage}%</b>
                  </p>
                )}

                <p className="text-gray-600 mb-2">
                  Duration: {test.duration} mins
                </p>

                {test.scheduledFrom && test.scheduledTo && (
                  <p className="text-gray-600 mb-2">
                    Available:{" "}
                    {new Date(test.scheduledFrom).toLocaleString()} →{" "}
                    {new Date(test.scheduledTo).toLocaleString()}
                  </p>
                )}

                <button
                  onClick={() => navigate(`/test/${test._id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Start Test
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            No available tests at the moment.
          </p>
        )}
      </div>

      {/* Scheduled Tests */}
      <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
        Scheduled Tests
      </h2>

      {scheduledTests.length === 0 ? (
        <p className="text-center text-gray-500">No scheduled tests available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledTests.map((test) => {
            const start = new Date(test.scheduledFrom);
            const end = new Date(test.scheduledTo);
            const now = new Date();
            const isAvailable =
              test.isAvailable || (now >= start && now <= end);
            const isExpired = test.isExpired || now > end;

            const percentage =
              test.totalMarks
                ? ((test.obtainedMarks / test.totalMarks) * 100).toFixed(2)
                : null;

            if (isExpired) return null;

            return (
              <div
                key={test._id}
                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {test.title}
                </h3>

                {percentage !== null && (
                  <p className="text-gray-600 mb-2">
                    Score: <b>{percentage}%</b>
                  </p>
                )}

                <p className="text-gray-600 mb-2">From: {start.toLocaleString()}</p>
                <p className="text-gray-600 mb-2">To: {end.toLocaleString()}</p>
                <p className="text-gray-600 mb-3">
                  Duration: {test.duration} mins
                </p>

                {!isAvailable && !isExpired && (
                  <p className="text-yellow-600 font-semibold mb-2">
                    Starts in: {test.countdown || "Loading..."}
                  </p>
                )}

                <button
                  onClick={() => navigate(`/test/${test._id}`)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded transition ${
                    isAvailable
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-700"
                  }`}
                >
                  {isAvailable ? "Start Test" : "Not Available Yet"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

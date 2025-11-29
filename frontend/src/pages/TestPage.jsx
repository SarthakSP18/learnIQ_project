import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/BackButton";

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // store remaining time in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    getTestDetails();
  }, []);

  const getTestDetails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tests");
      const selected = res.data.find((t) => t._id === id);
      setTest(selected);

      if (selected?.duration) {
        setTimeLeft(selected.duration * 60); // convert minutes → seconds
      }
    } catch (error) {
      console.error("Error fetching test:", error);
    }
  };

  // ⏱️ Timer logic
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // 🕒 Format time (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  // 🧠 Auto-submit when time is over
  const handleAutoSubmit = async () => {
    alert("Time is up! Your test will be submitted automatically.");
    await handleSubmit(true);
  };

  const handleSubmit = async (auto = false) => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const formattedAnswers = Object.keys(answers).map((qid) => ({
      questionId: qid,
      selectedOption: answers[qid],
    }));

    try {
      const body = {
        studentId: user._id,
        testId: id,
        answers: formattedAnswers,
      };

      await axios.post("http://localhost:5000/api/results/submit", body);

      if (!auto) alert("Test submitted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test!");
    }
  };

  if (!test) return <div className="text-center mt-10">Loading Test...</div>;

  return (
    <div className="p-6 mt-8">
     <BackButton/>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">{test.title}</h2>
        {timeLeft !== null && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded font-semibold shadow">
            Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {test.questions.map((q, index) => (
        <div key={q._id} className="mb-6 p-4 border rounded bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-2">
            {index + 1}. {q.questionText}
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(q.options).map(([key, value]) => (
              <label
                key={key}
                className={`border rounded p-2 cursor-pointer ${
                  answers[q._id] === key ? "bg-blue-100 border-blue-600" : ""
                }`}
              >
                <input
                  type="radio"
                  name={q._id}
                  value={key}
                  checked={answers[q._id] === key}
                  onChange={() => handleSelect(q._id, key)}
                  className="mr-2"
                />
                {key}) {value}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={() => handleSubmit(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestPage;

// 🟦 FULL updated admin file
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardCards from "../components/AdminDashboardCards";
import BackButton from "../components/BackButton";

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [customCategory, setCustomCategory] = useState("");

  const [newQ, setNewQ] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    category: "",
  });

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    const res = await axios.get("http://localhost:5000/api/questions");
    setQuestions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      newQ.category === "Others" ? customCategory.trim() : newQ.category;

    if (!finalCategory) {
      alert("Please enter valid category");
      return;
    }

    const questionData = {
      questionText: newQ.questionText,
      options: {
        optionA: newQ.optionA,
        optionB: newQ.optionB,
        optionC: newQ.optionC,
        optionD: newQ.optionD,
      },
      correctAnswer: newQ.correctAnswer,
      category: finalCategory,
    };

    await axios.post("http://localhost:5000/api/questions/add", questionData);

    alert("Question added successfully!");

    setNewQ({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      category: "",
    });

    setCustomCategory("");

    getQuestions();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/questions/${id}`);
    alert("Question deleted!");
    getQuestions();
  };

  return (
    <div className="p-6 mt-8">
      <BackButton />
      <h2 className="text-3xl text-blue-600 font-bold text-center mb-6">
        Manage/Add Questions
      </h2>

      <AdminDashboardCards />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 shadow rounded mb-8"
      >
        <h3 className="text-xl font-semibold mb-4">Add New Question</h3>

        <input
          type="text"
          placeholder="Question Text"
          value={newQ.questionText}
          onChange={(e) =>
            setNewQ({ ...newQ, questionText: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="text"
          placeholder="Option A"
          value={newQ.optionA}
          onChange={(e) => setNewQ({ ...newQ, optionA: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="text"
          placeholder="Option B"
          value={newQ.optionB}
          onChange={(e) => setNewQ({ ...newQ, optionB: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="text"
          placeholder="Option C"
          value={newQ.optionC}
          onChange={(e) => setNewQ({ ...newQ, optionC: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="text"
          placeholder="Option D"
          value={newQ.optionD}
          onChange={(e) => setNewQ({ ...newQ, optionD: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="text"
          placeholder="Correct Answer (A/B/C/D)"
          value={newQ.correctAnswer}
          onChange={(e) =>
            setNewQ({ ...newQ, correctAnswer: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
        />

        <select
          value={newQ.category}
          onChange={(e) => {
            const value = e.target.value;

            setNewQ({ ...newQ, category: value });
            if (value !== "Others") setCustomCategory("");
          }}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select Category</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Express">Express</option>
          <option value="MongoDB">MongoDB</option>
          <option value="Others">Others</option>
        </select>

        {newQ.category === "Others" && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Question
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3 text-center">All Questions</h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q) => (
          <div key={q._id} className="border p-4 bg-white rounded shadow">
            <p className="font-semibold mb-2">{q.questionText}</p>
            <p className="text-sm text-gray-600">Category: {q.category}</p>
            <p className="text-sm text-gray-600">
              Correct: {q.correctAnswer}
            </p>

            <button
              onClick={() => handleDelete(q._id)}
              className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

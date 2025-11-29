import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

const CreateTest = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selected, setSelected] = useState([]);
  const [testTitle, setTestTitle] = useState("");

  const [difficulty, setDifficulty] = useState("Easy");  // ⭐ NEW

  const [duration, setDuration] = useState(30);
  const [testType, setTestType] = useState("Available");

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    getQuestions();
  }, [category, customCategory]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/questions/categories/all");
    setCategories(res.data);
  };

  const getQuestions = async () => {
    const res = await axios.get("http://localhost:5000/api/questions");
    const data = res.data;

    const finalCategory =
      category === "Others" && customCategory ? customCategory : category;

    setQuestions(
      finalCategory ? data.filter((q) => q.category === finalCategory) : data
    );
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!testTitle.trim()) return alert("Please enter test title");
    if (!difficulty) return alert("Please select difficulty level");
    if (selected.length === 0) return alert("Please select at least 1 question");

    if (!duration || duration <= 0) {
      alert("Duration must be greater than 0 minutes");
      return;
    }

    const finalCategory =
      category === "Others" ? customCategory.trim() : category;

    if (!finalCategory) return alert("Please select or enter valid category");

    if (testType === "Scheduled") {
      if (!fromDate || !toDate) return alert("Please select From and To dates");

      const now = new Date();
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from < now) return alert("From Date cannot be in the past");
      if (to < now) return alert("To Date cannot be in the past");
      if (from >= to) return alert("To Date must be after From Date");
    }

    const newTest = {
      title: testTitle.trim(),
      duration,
      difficulty,     // ⭐ ADDED
      category: finalCategory,
      questions: selected,
      testType,
      scheduledFrom: testType === "Scheduled" ? fromDate : null,
      scheduledTo: testType === "Scheduled" ? toDate : null,
    };

    await axios.post("http://localhost:5000/api/tests/create", newTest);

    alert("Test created successfully!");

    setTestTitle("");
    setSelected([]);
    setCategory("");
    setCustomCategory("");
    setFromDate("");
    setToDate("");
    setDuration(30);
    setDifficulty("Easy");   // reset
    setTestType("Available");
  };

  return (
    <div className="p-6 mt-8">
      <BackButton />

      <h2 className="text-3xl text-blue-600 font-bold text-center mb-6">
        Create Test
      </h2>

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mb-6">

        <input
          type="text"
          placeholder="Test Title"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* ⭐ NEW DROPDOWN */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="Available">Available Test</option>
          <option value="Scheduled">Scheduled Test</option>
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (e.target.value !== "Others") setCustomCategory("");
          }}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Filter by Category</option>
          <option value="React">React</option>
          <option value="Node.js">Nodejs</option>
          <option value="Express">Express</option>
          <option value="MongoDB">MongoDB</option>

          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}

          <option value="Others">Others</option>
        </select>

        {category === "Others" && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
        )}

        {testType === "Scheduled" && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block mb-1 font-medium">From Date</label>
              <input
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">To Date</label>
              <input
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        )}

        <input
          type="number"
          min="1"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        />
      </div>

      <h3 className="text-xl font-semibold mb-3 text-center">
        Select Questions
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q) => (
          <div
            key={q._id}
            onClick={() => handleSelect(q._id)}
            className={`border p-4 rounded cursor-pointer ${
              selected.includes(q._id)
                ? "border-blue-600 bg-blue-100"
                : "bg-white"
            }`}
          >
            {q.questionText}
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Test
        </button>
      </div>
    </div>
  );
};

export default CreateTest;

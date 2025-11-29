import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    const res = await axios.get("http://localhost:5000/api/tests");
    const test = res.data.find((t) => t._id === id);

    if (!test) return alert("Test not found!");

    setTitle(test.title);
    setQuestions(test.questions);
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/tests/update/${id}`, {
      title,
      questions,
    });

    alert("Test updated successfully!");
    navigate("/managetests");
  };

  const updateField = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (index, optionKey, value) => {
    const updated = [...questions];
    updated[index].options[optionKey] = value;
    setQuestions(updated);
  };

  return (
    <div className="p-6">
      <BackButton />
      <h2 className="text-3xl text-blue-600 font-bold mb-6 text-center">
        Edit Test
      </h2>

      <div className="max-w-2xl mx-auto bg-white p-5 rounded shadow">

        <label className="block mb-2 font-semibold">Test Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <h3 className="text-xl font-semibold mb-3">Questions</h3>

        {questions.map((q, index) => (
          <div key={index} className="border p-3 rounded mb-4 bg-gray-50">
            <label className="font-medium">Question {index + 1}</label>
            <input
              className="w-full border p-2 rounded mt-1 mb-3"
              value={q.questionText}
              onChange={(e) => updateField(index, "questionText", e.target.value)}
            />

            <label className="font-medium">Options</label>
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Option A"
              value={q.options.optionA}
              onChange={(e) => updateOption(index, "optionA", e.target.value)}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Option B"
              value={q.options.optionB}
              onChange={(e) => updateOption(index, "optionB", e.target.value)}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Option C"
              value={q.options.optionC}
              onChange={(e) => updateOption(index, "optionC", e.target.value)}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Option D"
              value={q.options.optionD}
              onChange={(e) => updateOption(index, "optionD", e.target.value)}
            />

            <label className="font-medium mt-3 block">Correct Answer</label>
            <input
              className="w-full border p-2 rounded"
              value={q.correctAnswer}
              onChange={(e) =>
                updateField(index, "correctAnswer", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
        >
          Update Test
        </button>
      </div>
    </div>
  );
};

export default EditTest;

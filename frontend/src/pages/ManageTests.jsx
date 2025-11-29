import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import { Link } from "react-router-dom";

const ManageTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    const res = await axios.get("http://localhost:5000/api/tests");
    setTests(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tests/${id}`);
    alert("Test deleted!");
    getTests();
  };

  return (
    <div className="p-6 mt-8">
      <BackButton />

      <h2 className="text-3xl text-blue-600 font-bold text-center mb-6">
        Manage Tests
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test._id} className="border p-4 rounded bg-white shadow">
            <h3 className="text-xl font-semibold mb-2">{test.title}</h3>

            <p className="text-gray-600 mb-3">
              Questions: {test.questions.length}
            </p>

            {/* EDIT BUTTON */}
            <Link
              to={`/admin/edit-test/${test._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-3 inline-block"
            >
              Edit
            </Link>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(test._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTests;

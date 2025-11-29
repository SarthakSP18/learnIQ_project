import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const Option = ({ label, text, isCorrectOption, isUserChoice }) => (
  <div
    className={`p-2 rounded mb-1 border flex items-center justify-between
      ${isCorrectOption ? "bg-green-100 border-green-400" : ""}
      ${isUserChoice && !isCorrectOption ? "bg-red-100 border-red-400" : ""}
    `}
  >
    <div>
      <strong className="mr-2">{label}.</strong>
      <span>{text}</span>
    </div>
    {isCorrectOption && <span className="text-sm">✅</span>}
    {!isCorrectOption && isUserChoice && <span className="text-sm">✖️</span>}
  </div>
);

const ResultDetails = () => {
  const { id } = useParams(); // result id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchResult();
    // eslint-disable-next-line
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/results/detail/${id}`);
      setResult(res.data.result);
      setPercentage(res.data.percentage ?? 0);
    } catch (err) {
      console.error("Fetch result error:", err);
      alert("Failed to load result details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!result) return <div className="p-6">No result found.</div>;

  const test = result.test || {};
  const student = result.student || {};

  return (
    <div className="p-6">
      <BackButton />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2">{test.title || "Test"}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Student: {student.name || "Unknown"} • Date: {new Date(result.createdAt).toLocaleString()}
        </p>

        <div className="flex gap-4 mb-4">
          <div className="px-4 py-2 bg-blue-50 rounded">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-xl font-bold">{result.correctAnswers} / {result.totalQuestions}</div>
          </div>
          <div className="px-4 py-2 bg-green-50 rounded">
            <div className="text-sm text-gray-500">Percentage</div>
            <div className="text-xl font-bold">{percentage}%</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Detailed Answers</h3>

        <div className="space-y-4">
          {result.submittedAnswers.map((sa, idx) => {
            const q = sa.questionId; // populated Question object
            const selected = sa.selectedOption; // e.g. "optionA" or "A"? depends on how you saved - adjust below if needed
            // Normalize selected: if the stored selectedOption is "optionA" or "A", handle both
            let selectedKey = (selected || "").toString().toLowerCase();
            if (selectedKey.length === 1) selectedKey = `option${selectedKey}`; // 'a' -> 'optiona'
            // question.correctAnswer may be "A"/"a" or "optionA" etc; normalize:
            const correctKey = q?.correctAnswer
              ? q.correctAnswer.toString().toLowerCase().startsWith("option")
                ? q.correctAnswer.toString().toLowerCase()
                : `option${q.correctAnswer.toString().toLowerCase()}`
              : "";

            const opts = q?.options || {};
            return (
              <div key={idx} className="p-4 border rounded">
                <div className="mb-2 font-medium">
                  {idx + 1}. {q?.questionText || "Question text not available"}
                </div>

                <div className="space-y-1">
                  <Option
                    label="A"
                    text={opts.optionA || "-"}
                    isCorrectOption={correctKey === "optiona"}
                    isUserChoice={selectedKey === "optiona"}
                  />
                  <Option
                    label="B"
                    text={opts.optionB || "-"}
                    isCorrectOption={correctKey === "optionb"}
                    isUserChoice={selectedKey === "optionb"}
                  />
                  <Option
                    label="C"
                    text={opts.optionC || "-"}
                    isCorrectOption={correctKey === "optionc"}
                    isUserChoice={selectedKey === "optionc"}
                  />
                  <Option
                    label="D"
                    text={opts.optionD || "-"}
                    isCorrectOption={correctKey === "optiond"}
                    isUserChoice={selectedKey === "optiond"}
                  />
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Your answer:{" "}
                  <strong>
                    {(selectedKey && selectedKey.replace("option", "").toUpperCase()) || "—"}
                  </strong>{" "}
                  • Correct:{" "}
                  <strong>{(correctKey && correctKey.replace("option", "").toUpperCase()) || "—"}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;

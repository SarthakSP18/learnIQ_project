import Result from "../models/Result.js";
import Test from "../models/Test.js";
import Question from "../models/Question.js";

// 🧠 Submit Test
export const submitTest = async (req, res) => {
  try {
    const { studentId, testId, answers } = req.body;
    // answers = [{ questionId, selectedOption }]

    const test = await Test.findById(testId).populate("questions");

    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    let correctAnswers = 0;
    const submittedAnswers = [];

    // Options are stored as optionA, optionB, optionC, optionD

    for (let ans of answers) {
      const question = await Question.findById(ans.questionId);
      const isCorrect =
        ans.selectedOption.toLowerCase() ===
        `option${question.correctAnswer.toLowerCase()}`;

      if (isCorrect) {
        score += 1; // 1 mark per correct answer
        correctAnswers++;
      }

      submittedAnswers.push({
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      });
    }

    const result = await Result.create({
      student: studentId,
      test: testId,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      submittedAnswers,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.id })
      .populate({
        path: "test",
        select: "title scheduledFrom scheduledTo"
      })
      .populate("student")
      .populate({
        path: "submittedAnswers.questionId",
        model: "Question",
        select: "questionText options correctAnswer"
      });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📈 Get results for a test WITH RANKINGS
export const getTestResults = async (req, res) => {
  try {
    const testId = req.params.id;

    if (testId === "dummy") {
      return res.status(200).json([]);
    }

    let results = await Result.find({ test: testId })
      .populate("student")
      .populate("test");

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Assign ranking
    let currentRank = 1;
    let lastScore = null;

    results = results.map((r, index) => {
      if (r.score !== lastScore) {
        currentRank = index + 1; // new rank whenever score changes
      }
      lastScore = r.score;

      return {
        ...r.toObject(),
        rank: currentRank,
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ NEW: Get detailed result with populated questions
export const getResultDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findById(id)
      .populate("student", "name email")
      .populate("test", "title")
      .populate({
        path: "submittedAnswers.questionId",
        model: "Question"
      });

    if (!result) return res.status(404).json({ message: "Result not found" });

    const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

    res.json({
      message: "Result fetched",
      result,
      percentage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/results/detail/:id
export const getResultById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Result.findById(id)
      .populate("student")
      .populate("test")
      .populate({
        path: "submittedAnswers.questionId",
        model: "Question",
        select: "questionText options correctAnswer difficulty category"
      });

    if (!result) return res.status(404).json({ message: "Result not found" });

    // Compute percentage to return as convenience
    const total = result.totalQuestions || 0;
    const correct = result.correctAnswers || 0;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({ result: result.toObject(), percentage });
  } catch (error) {
    console.error("getResultById error:", error);
    res.status(500).json({ message: error.message });
  }
};

import Question from "../models/Question.js";

// ➕ Add Question
export const addQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json({ message: "Question added successfully", newQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get All Questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Unique Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Question.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑️ Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Question
export const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Question updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

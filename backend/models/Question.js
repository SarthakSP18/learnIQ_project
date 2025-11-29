import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String
  },
  correctAnswer: { type: String, required: true },
  category: { type: String }, // e.g., Java, Python, etc.
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" }
});

const Question = mongoose.model("Question", questionSchema);
export default Question;

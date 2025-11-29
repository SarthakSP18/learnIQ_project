import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  duration: { type: Number, default: 30 },
  category: { type: String },
  testType: { type: String, default: "Available Tests" },
  scheduledFrom: { type: Date, default: null },
  scheduledTo: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});


const Test = mongoose.model("Test", testSchema);
export default Test;

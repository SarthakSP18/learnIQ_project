import express from "express";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  updateQuestion,
  getCategories,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/add", addQuestion);
router.get("/", getQuestions);
router.delete("/:id", deleteQuestion);
router.put("/:id", updateQuestion);
router.get("/categories/all", getCategories);

export default router;

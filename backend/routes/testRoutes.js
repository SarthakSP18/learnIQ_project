
import express from "express";
import { createTest, getTests, deleteTest, getCategorizedTests,updateTest } from "../controllers/testController.js";

const router = express.Router();

router.post("/create", createTest);
router.get("/", getTests);
router.delete("/:id", deleteTest);
router.get("/categorized", getCategorizedTests);
router.put("/update/:id", updateTest);


export default router;  

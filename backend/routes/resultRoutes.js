import express from "express";
import {
  submitTest,
  getStudentResults,
  getTestResults,getResultDetails,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/submit", submitTest);
router.get("/student/:id", getStudentResults);
router.get("/test/:id", getTestResults);
router.get("/detail/:id", getResultDetails);   // <-- NEW ROUTE
// router.get("/details/:id", getResultById);


export default router;

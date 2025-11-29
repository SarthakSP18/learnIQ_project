import express from "express";
import { registerUser, loginUser, getAllUsers,updateStudent } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers); //  new route
router.put("/update/:id", updateStudent);

export default router;

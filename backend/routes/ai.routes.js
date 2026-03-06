import { Router } from "express";
import {
    generateSummary,
    generateBullets,
    reviewResume,
    matchJob,
    generateInterviewQuestions,
} from "../controllers/ai.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

// All protected routes 

router.post("/generate-summary", auth, generateSummary);
router.post("/generate-bullets", auth, generateBullets);
router.post("/review-resume", auth, reviewResume);
router.post("/match-job", auth, matchJob);
router.post("/interview-questions", auth, generateInterviewQuestions);

export default router;
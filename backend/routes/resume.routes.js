import { Router } from "express";
import {
    createResume,
    getAllResumes,
    getResumeById,
    updateResume,
    deleteResume,
} from "../controllers/resume.controller.js";
import auth from "../middleware/auth.middleware.js"

const router = Router();

// All routes are protected 
router.post("/", auth, createResume);
router.get("/", auth, getAllResumes);
router.get("/:id", auth, getResumeById);
router.put("/:id", auth, updateResume);
router.delete("/:id", auth, deleteResume);



export default router;
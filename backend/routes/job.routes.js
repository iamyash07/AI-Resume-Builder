import { Router } from "express";
import {
    createApplication,
    getAllApplications,
    updateApplication,
    deleteApplication,
} from "../controllers/job.controller.js";
import auth from "../middleware/auth.middleware.js"

const router = Router();

router.post("/", auth, createApplication);
router.get("/", auth, getAllApplications);
router.put("/:id", auth, updateApplication);
router.delete("/:id", auth, deleteApplication);

export default router;
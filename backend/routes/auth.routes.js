import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js"
import auth from "../middleware/auth.middleware.js"


const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login)

// Protected route
router.get("/profile", auth , getProfile);



export  default router;
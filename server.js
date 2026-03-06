import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./backend/config/db.js";

import authRoutes from "./backend/routes/auth.routes.js";
import resumeRoutes from "./backend/routes/resume.routes.js";
import aiRoutes from "./backend/routes/ai.routes.js";
import jobRoutes from "./backend/routes/job.routes.js";

const app = express();
const PORT = process.env.PORT || 6999; 

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "🚀 AI Resume Builder API is running!",
    });
});

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => { 
        console.log(`🚀 Server running!`);
        console.log(`👉 http://localhost:${PORT}`);
        console.log(`👉 http://127.0.0.1:${PORT}`);
    });
});
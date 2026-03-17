import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./backend/config/db.js";

// Routes
import authRoutes from "./backend/routes/auth.routes.js";
import resumeRoutes from "./backend/routes/resume.routes.js";
import aiRoutes from "./backend/routes/ai.routes.js";
import jobRoutes from "./backend/routes/job.routes.js";

const app = express();
const PORT = process.env.PORT || 6999;

// --- Middleware ---
app.use(express.json()); // Parses incoming JSON requests

// --- CORS Configuration (Production Ready) ---
app.use(cors({
    origin: [
        "http://localhost:3500",      // Local Frontend
        "https://ai-resume-builder-frontend-ten.vercel.app"
    ],
    credentials: true,                // Allows Cookies & Authorization Headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);

// --- Health Check Route ---
app.get("/", (req, res) => {
    res.status(200).json({
        message: "🚀 AI Resume Builder API is running!",
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// --- Server Startup ---
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`👉 Local: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
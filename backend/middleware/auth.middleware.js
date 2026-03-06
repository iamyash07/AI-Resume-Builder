import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const auth = async (req, res, next) => {
    try {
        // ── Get Token from Header ──
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            //                           ↑ startsWith (with 's')
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first.",
            });
        }

        // ── Extract Token ──
    
        const token = authHeader.split(" ")[1];

        // ── Verify Token ──
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ── Find User ──
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        // ── Attach user to request ──
        req.user = user;
        next();

    } catch (error) {
        console.error("❌ Auth Middleware Error:", error.message);
        res.status(401).json({
            success: false,
            message: "Token is invalid or expired. Please login again",
        });
    }
};

export default auth;
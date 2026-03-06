import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: false,  
            default: null,
        },

        company: {
            type: String,
            required: [true, "Company name is required"],
        },

        position: {
            type: String,
            required: [true, "Position is required"],
        },

        jobDescription: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["saved", "applied", "interview", "offer", "rejected"],
            default: "saved",
        },

        matchScore: {
            type: Number,
            default: null,
        },

        aiSuggestions: [{ type: String }],

        appliedDate: {
            type: Date,
            required: false,  
            default: null,
        },

        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            default: "Untitled Resume",
        },

        personalInfo: {
            fullName: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: {
                type: String,
                default: "",
                trim: true,
                validate: {
                    validator: function (v) {
                        if (v === "" || v === null || v === undefined) return true;
                        const cleaned = v.replace(/[\s\-\+]/g, "");
                        return /^\d{10}$/.test(cleaned);
                    },
                    message: "Phone number must be exactly 10 digits",
                },
            },
            location: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            portfolio: { type: String, default: "" },
        },

        summary: {
            type: String,
            default: "",
        },

        experience: [
            {
                jobTitle: { type: String, required: true },
                company: { type: String, required: true },
                location: { type: String, default: "" },
                startDate: { type: String, required: true },
                endDate: { type: String, default: "Present" },
                current: { type: Boolean, default: false },
                bullets: [{ type: String }],
            },
        ],

        education: [
            {
                degree: { type: String, required: true },
                school: { type: String, required: true },
                location: { type: String, default: "" },
                startDate: { type: String, required: true },
                endDate: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],

        skills: [{ type: String }],

        projects: [
            {
                title: { type: String, required: true },
                description: { type: String, default: "" },
                techStack: [{ type: String }],
                liveLink: { type: String, default: "" },
                githubLink: { type: String, default: "" },
            },
        ],
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
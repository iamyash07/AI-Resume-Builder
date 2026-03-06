import Resume from "../models/Resume.model.js";

export const createResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Resume created successfully!",
            data: { resume },
        });

    } catch (error) {
        console.error("Create Resume Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create resume",
        });
    }
}

// ── Get All Resumes ──
export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.user._id
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: resumes.length,
            data: { resumes },
        });
    } catch (error) {
        console.error("❌ Get Resumes Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch resumes",
            error: error.message,
        });
    }
};

export const getResumeById = async (req, res) => {
    try {
        // Check BOTH _id AND userId for security
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        res.status(200).json({
            success: true,
            data: { resume },
        });
    } catch (error) {
        console.error("Get Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch resume",
        });
    }
};

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findByIdAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
            },
            req.body,
            { new: true, runValidators: true }
        )

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        res.status(200).json({
            success: true,
            message: " Resume updated successfully!",
            data: { resume },
        });

    } catch (error) {
        console.error("Update Resume Error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to update resume"
        });
    }
};


export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume deleted!",
        });
    } catch (error) {
        console.error("❌ Delete Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete resume",
            error: error.message,
        });
    }
};


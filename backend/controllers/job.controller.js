import JobApplication from "../models/JobApplication.model.js";


export const createApplication = async (req, res) => {
    try {
        const application = await JobApplication.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Application Saved!",
            data: { application },
        });
    } catch (error) {
        console.log(" Create  Application Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed  to  save application",
        });

    }
};


export const getAllApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({
            userId: req.user._id,
        })
            .populate("resumeId", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications }
        });

    } catch (error) {
        console.error("Get Application Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
};


export const updateApplication = async (req, res) => {
    try {
        console.log("📩 Update body:", req.body); // ← debug

        const application = await JobApplication.findOneAndUpdate(
            { 
                _id: req.params.id, 
                userId: req.user._id 
            },
            { $set: req.body }, // ✅ Add $set operator
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Application updated successfully!",
            data: { application },
        });
    } catch (error) {
        console.error("Update Application Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update application",
            error: error.message,
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findByIdAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: " Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted"
        });


    } catch (error) {
        console.error("Delete Application Error:", error);

        res.status(500).json({
            success: false,
            message: " Failed to delete the application"
        });
    }
};
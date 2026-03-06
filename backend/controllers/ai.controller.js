import { generateAIResponse } from "../utils/aiHelper.js";
import Resume from "../models/Resume.model.js";


export const generateSummary = async (req, res) => {
    try {
        const { skills, experience, targetRole } = req.body;

        if (!targetRole) {
            return res.status(400).json({
                success: false,
                message: "Please provide a target role",
            });
        }

        const prompt = `
        You are an expert resume writer. Write a professional summary for a resume.
        Details:
        - Target Role : ${targetRole}
        - Skills : ${skills ? skills.join(", ") : "Not specified"}
        - Experience Level : ${experience || "Entry level"}
        
        Rules : 
        - Write in FIRST person (no "I" at the start though)
        - Keep it 2-3 sentences
        - Focus on value the candidate brings
        - Includes relevent keywords for ATS (Application Tracking System)
        - Be professional but not generic
        - Do NOT user buzzword like "synergy" or "leverage" 
        
         Return ONLY the summary text, no quotes, no labels, no extra formatting 
         `;

        const summary = await generateAIResponse(prompt);

        res.status(200).json({
            success: true,
            data: { summary: summary.trim() },
        });
    } catch (error) {
        console.error("Generate Summary Error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to generate the summary"
        });

    }
};

export const generateBullets = async (req, res) => {
    try {
        const { jobTitle, company, description } = req.body;

        if (!jobTitle || !company) {
            return res.status(400).json({
                success: false,
                message: "Please provide Job title and company",
            });
        }

        const prompt = `
You are an expert resume writer. Generate 4 bullet points for a resume work experience section.

Details :
- Job Title : ${jobTitle}
- Company : ${company}
- Additioanl Context : ${description || "None Provided"}

Rules:
- Start each bullet  with a STRONG action verb (Built, Developed, Led, Implemented, etc.)
- Includes METRICS where possible (percentages, numbers, team sizes)
- Focus on IMPACT and RESULTS, not just responsibilities
- Each bullet should be 1-2 lines max
- Make them relevent to the tech/software industry 
- Use XYZ formula : "Accomplished [X] as measured by [Y], by doing [Z]"

Return the bullets as a JSON array of strings. Example format;
["bullet 1", "bullet 2", "bullet 3", "bullet 4"]

Return ONLY the JSON array, nothing else.

`;

        const response = await generateAIResponse(prompt);

        let bullets;
        try {
            bullets = JSON.parse(response);
        } catch {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                bullets = JSON.parse(jsonMatch[0]);
            } else {
                bullets = response
                    .split("\n")
                    .filter((line) => line.trim().length > 0)
                    .map((line) => line.replace(/^[-•*]\s*/, "").trim());
            }
        }
        res.status(200).json({
            success: true,
            data: { bullets },
        });

    } catch (error) {
        console.error("Generate Bullets Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate bullet points",
        });
    }
};

export const reviewResume = async (req, res) => {
    try {
        const { resumeId } = req.body;

        // Fetch resume from database
        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        // ── Convert resume to readable text for AI ──
        // Template literals (backticks) make this easy!
        const resumeText = `
Name: ${resume.personalInfo.fullName}
Email: ${resume.personalInfo.email}
Location: ${resume.personalInfo.location}
LinkedIn: ${resume.personalInfo.linkedin}
GitHub: ${resume.personalInfo.github}

Summary: ${resume.summary}

Experience:
${resume.experience
    .map(
        (exp) => `
  ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.bullets.map((b) => `  • ${b}`).join("\n")}
`
    )
    .join("\n")}

Education:
${resume.education
    .map(
        (edu) =>
            `  ${edu.degree} - ${edu.school} (${edu.startDate} - ${edu.endDate})`
    )
    .join("\n")}

Skills: ${resume.skills.join(", ")}

Projects:
${resume.projects
    .map(
        (proj) => `
  ${proj.title}: ${proj.description}
  Tech: ${proj.techStack.join(", ")}
`
    )
    .join("\n")}
        `;

        const prompt = `
You are a senior tech recruiter and resume expert. Review this resume and provide detailed feedback.

RESUME:
${resumeText}

Provide your review in this JSON format:
{
  "score": <number 0-100>,
  "overallFeedback": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "missingElements": ["<missing element 1>", "<missing element 2>"],
  "atsScore": <number 0-100>,
  "atsTips": ["<ATS tip 1>", "<ATS tip 2>"]
}

Scoring:
- 0-30: Major issues
- 31-50: Below average
- 51-70: Average
- 71-85: Good
- 86-100: Excellent

Be specific. Reference actual content from the resume.
Return ONLY valid JSON, no other text.
        `;

        const response = await generateAIResponse(prompt);

        let review;
        try {
            review = JSON.parse(response);
        } catch {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                review = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse AI review response");
            }
        }

        res.status(200).json({
            success: true,
            data: { review },
        });
    } catch (error) {
        console.error("Review Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to review resume",
        });
    }
};

export const matchJob = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Please provide a job description",
            });
        }

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        const prompt = `
You are an expert ATS analyzer. Compare this resume with the job description.

RESUME:
Name: ${resume.personalInfo.fullName}
Summary: ${resume.summary}
Skills: ${resume.skills.join(", ")}
Experience: ${resume.experience
            .map(
                (exp) =>
                    `${exp.jobTitle} at ${exp.company}: ${exp.bullets.join("; ")}`
            )
            .join(" | ")}
Projects: ${resume.projects
            .map((p) => `${p.title}: ${p.techStack.join(", ")}`)
            .join(" | ")}

JOB DESCRIPTION:
${jobDescription}

Provide analysis in this JSON format:
{
  "matchPercentage": <number 0-100>,
  "matchedSkills": ["<skill that matches>"],
  "missingSkills": ["<required skill not in resume>"],
  "suggestions": ["<specific actionable suggestion>"],
  "keywordsToAdd": ["<important keyword from JD missing in resume>"],
  "experienceMatch": "<brief assessment of experience relevance>"
}

Be accurate. Only list skills as "matched" if they actually appear in the resume.
Return ONLY valid JSON.
        `;

        const response = await generateAIResponse(prompt);

        let matchResult;
        try {
            matchResult = JSON.parse(response);
        } catch {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                matchResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse AI match response");
            }
        }

        res.status(200).json({
            success: true,
            data: { matchResult },
        });
    } catch (error) {
        console.error("Match Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze job match",
        });
    }
};


//interview-questions

export const generateInterviewQuestions = async (req, res) => {
    try {
        const { jobTitle, company, jobDescription } = req.body;

        if (!jobTitle) {
            return res.status(400).json({
                success: false,
                message: "Please provide a job title",
            });
        }

        const prompt = `
You are an experienced tech interviewer. Generate interview prep questions.

Details:
- Position: ${jobTitle}
- Company: ${company || "Not specified"}
- Job Description: ${jobDescription || "Not provided"}

Generate in this JSON format:
{
  "technical": [
    { "question": "<technical question>", "tip": "<how to answer>" }
  ],
  "behavioral": [
    { "question": "<behavioral question>", "tip": "<how to answer>" }
  ],
  "situational": [
    { "question": "<situational question>", "tip": "<how to answer>" }
  ]
}

Generate 3 questions for each category (9 total).
Make questions specific to the role.
Return ONLY valid JSON.
        `;

        const response = await generateAIResponse(prompt);

        let questions;
        try {
            questions = JSON.parse(response);
        } catch {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse AI questions response");
            }
        }

        res.status(200).json({
            success: true,
            data: { questions },
        });
    } catch (error) {
        console.error("Interview Questions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate interview questions",
        });
    }
};
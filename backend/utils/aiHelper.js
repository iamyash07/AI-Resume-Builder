import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (prompt) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2048,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq AI Error:", error.message);
        throw new Error("AI service is currently unavailable");
    }
};
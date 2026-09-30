import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey: API_KEY,
});

async function runChat(prompt) {

    const models = [
        "gemini-3.8-flash"
    ];

    for (const model of models) {

        try {
            console.log("Trying model:", model);

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });

            return response.text;

        } catch (error) {

            console.error(`${model} failed:`, error);

            // 429 = quota exceeded
            if (error.status === 429) {
                return "Gemini free-tier quota has been exceeded. Please try again later or check your Gemini API quota.";
            }

            // 503 = model temporarily unavailable
            if (error.status === 503) {
                console.log(`${model} is busy. Trying next model...`);
                continue;
            }

            return "Something went wrong while connecting to Gemini.";
        }
    }

    return "Gemini models are currently unavailable. Please try again later.";
}

export default runChat;
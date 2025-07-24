
import { GoogleGenAI } from "@google/genai";

// This file is a placeholder to demonstrate knowledge of the Gemini API structure.
// A generative AI is not applicable for the core functionality of a YouTube downloader.
// The API key is expected to be in the environment variables.

const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("Gemini API key not found. The service will not be available.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * A dummy function to show how one might use Gemini to generate a creative
 * title for a downloaded file, though this is not used in the app.
 * @param videoTitle The original title of the video.
 * @returns A promise that resolves to a creative new title.
 */
export const generateCreativeTitle = async (videoTitle: string): Promise<string> => {
    if (!apiKey) return `Creative - ${videoTitle}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a short, creative, file-safe name for a video titled: "${videoTitle}". Respond with only the name.`,
        });
        return response.text.trim() || videoTitle;
    } catch (error) {
        console.error("Error generating title with Gemini:", error);
        // Fallback to a simple modification if API fails
        return videoTitle;
    }
};

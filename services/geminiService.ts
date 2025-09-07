
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const generateImageFromText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });
        
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating image from text:", error);
        throw error;
    }
};


export const editImageWithText = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const base64Data = base64Image.split(',')[1];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageMimeType = part.inlineData.mimeType;
                return `data:${imageMimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No edited image was returned from the model.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};

export const generateCreativePrompt = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a random, creative, and visually descriptive image prompt. The prompt should be a single sentence, under 30 words.',
            config: {
                systemInstruction: "You are a creative assistant for an AI image generator. Your task is to generate short, visually descriptive, and imaginative prompts for creating images. Return only the prompt itself.",
            },
        });
        return response.text.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error generating creative prompt:", error);
        throw new Error("Could not generate a creative prompt.");
    }
};

export const enhancePrompt = async (currentPrompt: string): Promise<string> => {
    if (!currentPrompt.trim()) {
        return "";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Take this prompt and make it more visually descriptive and artistic: "${currentPrompt}"`,
            config: {
                systemInstruction: "You are a creative assistant for an AI image generator. Your task is to take a user's prompt and make it more visually descriptive, artistic, and detailed. Return only the enhanced prompt, without any conversational text.",
            },
        });
        return response.text.trim().replace(/^"|"$/g, ''); // Remove quotes if model adds them
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        throw new Error("Could not enhance the prompt.");
    }
};

if (!process.env.ELEVENLABS_API_KEY) {
    console.warn("ELEVENLABS_API_KEY environment variable not set. Audio generation will fail.");
}

export const VOICES = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "Calm & Clear" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Deep & Serious" },
    { id: "pMsXgVXv3BLzUgSXRplE", name: "Serena", description: "Cheerful & Engaging" },
    { id: "jBpfuIE2acCO8z3wKNLl", name: "Gigi", description: "Playful & Animated" },
];

const FAL_RUN_TTS_URL = "https://fal.run/moments-ai/text-to-speech";

export const generateSpeech = async (text: string, voiceId: string): Promise<string> => {
    if (!process.env.ELEVENLABS_API_KEY) {
        throw new Error("ElevenLabs API key is not configured.");
    }
    
    try {
        const response = await fetch(FAL_RUN_TTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voice_id: voiceId,
                api_key: process.env.ELEVENLABS_API_KEY, // Pass key for Fal script to use
            }),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to generate speech from Fal.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail?.message || errorMessage;
            } catch (e) {
                // Ignore if response is not json
            }
            throw new Error(errorMessage);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;

    } catch (error) {
        console.error("Error generating speech via Fal:", error);
        throw error;
    }
};

import { useState, useRef, useCallback } from 'react';
import { editImageWithText, fileToBase64, generateVideoFromImageAndText } from '../services/geminiService';
import { generateSpeech } from '../services/elevenLabsService';
import { GenerationResult } from '../types';

interface SourceImage {
    file: File;
    dataUrl: string;
}

export const useImageEditor = () => {
    const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
    const [prompt, setPrompt] = useState<string>('Make the colors more vibrant');
    const [generations, setGenerations] = useState<GenerationResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToBase64(file);
                setSourceImage({ file, dataUrl });
                setGenerations([]);
                setError(null);
            } catch (e) {
                setError("Could not load image file.");
                console.error(e);
            }
        }
    };
    
    const handleGenerate = useCallback(async () => {
        const imageToEdit = generations.length > 0 ? generations[0].imageUrl : sourceImage?.dataUrl;
        const mimeType = sourceImage?.file.type ?? 'image/png';

        if (!imageToEdit || !prompt || isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            const newImageUrl = await editImageWithText(imageToEdit, mimeType, prompt);
            const newGeneration: GenerationResult = { id: crypto.randomUUID(), prompt, imageUrl: newImageUrl };
            setGenerations(prev => [newGeneration, ...prev]);
        } catch (e) {
            setError('Failed to edit image. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [generations, sourceImage, prompt, isLoading]);

    const handleGenerateAudio = async (id: string, text: string, voiceId: string) => {
        const audioUrl = await generateSpeech(text, voiceId);
        setGenerations(prevGenerations => 
            prevGenerations.map(gen => 
                gen.id === id ? { ...gen, audioUrl, audioPrompt: text } : gen
            )
        );
    };
    
    const handleAnimate = async (id: string, base64Image: string, prompt: string) => {
        const videoUrl = await generateVideoFromImageAndText(base64Image, prompt);
        setGenerations(prevGenerations => 
            prevGenerations.map(gen => 
                gen.id === id ? { ...gen, videoUrl } : gen
            )
        );
    };

    const handleRefine = () => {
        promptInputRef.current?.focus();
        promptInputRef.current?.select();
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        sourceImage,
        prompt,
        setPrompt,
        generations,
        isLoading,
        error,
        fileInputRef,
        promptInputRef,
        handleFileChange,
        handleGenerate,
        handleGenerateAudio,
        handleAnimate,
        handleRefine,
        triggerFileUpload,
    };
};

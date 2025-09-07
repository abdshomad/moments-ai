import React, { useState } from 'react';
import { generateImageFromText } from '../services/geminiService';
import { generateSpeech } from '../services/elevenLabsService';
import { GenerationResult } from '../types';
import Spinner from './common/Spinner';
import ImageCard from './common/ImageCard';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A golden retriever wearing a wizard hat, flying over a rainbow');
    const [generations, setGenerations] = useState<GenerationResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            const imageUrl = await generateImageFromText(prompt);
            const newGeneration: GenerationResult = {
                id: crypto.randomUUID(),
                prompt,
                imageUrl,
            };
            setGenerations(prev => [newGeneration, ...prev]);
        } catch (e) {
            setError('Failed to generate image. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAudio = async (id: string, text: string, voiceId: string) => {
        const audioUrl = await generateSpeech(text, voiceId);
        setGenerations(prevGenerations => 
            prevGenerations.map(gen => 
                gen.id === id ? { ...gen, audioUrl, audioPrompt: text } : gen
            )
        );
    };
    
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic city skyline at sunset, with flying cars"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none h-24"
                    rows={3}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt}
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                    {isLoading ? <><Spinner className="-ml-1 mr-3" /> Generating...</> : 'Generate Image'}
                </button>
            </div>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            <div className="mt-8">
                {isLoading && generations.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-gray-500 p-8">
                         <Spinner />
                         <p className="mt-2">Generating your first masterpiece...</p>
                     </div>
                )}
                {generations.length > 0 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generations.map((gen, index) => (
                           <ImageCard
                             key={gen.id}
                             result={gen}
                             isLatest={index === 0}
                             onGenerateAudio={handleGenerateAudio}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
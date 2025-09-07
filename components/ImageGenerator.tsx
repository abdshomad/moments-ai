
import React, { useState } from 'react';
import { generateImageFromText, generateCreativePrompt, enhancePrompt } from '../services/geminiService';
import { generateSpeech } from '../services/elevenLabsService';
import { GenerationResult } from '../types';
import Spinner from './common/Spinner';
import ImageCard from './common/ImageCard';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A golden retriever wearing a wizard hat, flying over a rainbow');
    const [generations, setGenerations] = useState<GenerationResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreativeAssistantLoading, setIsCreativeAssistantLoading] = useState<null | 'surprise' | 'enhance'>(null);

    const handleGenerate = async (promptToUse?: string) => {
        const currentPrompt = promptToUse || prompt;
        if (!currentPrompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            const imageUrl = await generateImageFromText(currentPrompt);
            const newGeneration: GenerationResult = {
                id: crypto.randomUUID(),
                prompt: currentPrompt,
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

    const handleSurpriseMe = async () => {
        setIsCreativeAssistantLoading('surprise');
        setError(null);
        try {
            const creativePrompt = await generateCreativePrompt();
            setPrompt(creativePrompt);
            await handleGenerate(creativePrompt); 
        } catch (e) {
            setError('Failed to generate a creative prompt. Please try again.');
            console.error(e);
        } finally {
            setIsCreativeAssistantLoading(null);
        }
    };

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsCreativeAssistantLoading('enhance');
        setError(null);
        try {
            const enhancedPrompt = await enhancePrompt(prompt);
            setPrompt(enhancedPrompt);
        } catch (e) {
            setError('Failed to enhance prompt. Please try again.');
            console.error(e);
        } finally {
            setIsCreativeAssistantLoading(null);
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
        <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex flex-col gap-4">
                 <details className="group">
                    <summary className="list-none flex items-center justify-between cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <span>Creative Assistant</span>
                        <svg className="h-5 w-5 transform group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-4 p-4 bg-input/50 rounded-lg flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSurpriseMe}
                            disabled={isLoading || !!isCreativeAssistantLoading}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isCreativeAssistantLoading === 'surprise' ? <><Spinner/> Thinking...</> : <>✨ Surprise Me</>}
                        </button>
                        <button
                            onClick={handleEnhancePrompt}
                            disabled={isLoading || !!isCreativeAssistantLoading || !prompt}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isCreativeAssistantLoading === 'enhance' ? <><Spinner/> Enhancing...</> : <>🪄 Enhance Prompt</>}
                        </button>
                    </div>
                </details>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic city skyline at sunset, with flying cars"
                    className="w-full p-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none h-24"
                    rows={3}
                />
                <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading || !prompt}
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                    {isLoading ? <><Spinner className="-ml-1 mr-3" /> Generating...</> : 'Generate Image'}
                </button>
            </div>

            {error && <p className="text-destructive mt-4 text-center">{error}</p>}
            
            <div className="mt-8">
                {isLoading && generations.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
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

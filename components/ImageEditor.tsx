


import React from 'react';
import Spinner from './common/Spinner';
import ImageCard from './common/ImageCard';
import { useImageEditor } from '../hooks/useImageEditor';

const ImageEditor: React.FC = () => {
    const {
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
    } = useImageEditor();
    
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 w-full">
                <div className="bg-card p-6 rounded-lg border border-border sticky top-8">
                    <h3 className="text-2xl font-bold mb-4">Controls</h3>
                    <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={triggerFileUpload} data-tour-id="step-2-upload" className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 px-4 rounded-md transition-colors">
                        {sourceImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {sourceImage && (
                        <>
                            <textarea
                                ref={promptInputRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Show them celebrating with a tiny trophy"
                                className="w-full p-3 mt-4 bg-input border border-border rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none h-24"
                                rows={3}
                                data-tour-id="step-3-prompt"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt}
                                className="w-full mt-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                                data-tour-id="step-4-generate"
                            >
                                {isLoading ? <><Spinner className="-ml-1 mr-3" /> Generating...</> : 'Generate Edit'}
                            </button>
                        </>
                    )}
                    {error && <p className="text-destructive mt-4 text-center">{error}</p>}
                </div>
            </div>

            <div className="lg:w-2/3 w-full" data-tour-id="step-5-results">
                {!sourceImage ? (
                    <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground">Upload a photo to get started</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isLoading && (
                                <div className="bg-card p-4 rounded-lg border border-border flex flex-col items-center justify-center animate-pulse">
                                    <Spinner />
                                    <p className="text-muted-foreground mt-2">Creating your vision...</p>
                                </div>
                            )}
                            {generations.map((gen, index) => (
                               <ImageCard 
                                 key={gen.id} 
                                 result={gen} 
                                 isLatest={index === 0} 
                                 onRefine={index === 0 ? handleRefine : undefined}
                                 onGenerateAudio={handleGenerateAudio}
                                 onAnimate={handleAnimate}
                                />
                            ))}
                        </div>
                        <h4 className="text-lg font-semibold text-muted-foreground border-b border-border pb-2 mb-4">Original Image</h4>
                         <ImageCard result={{ id: 'original', prompt: 'Original', imageUrl: sourceImage.dataUrl }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEditor;

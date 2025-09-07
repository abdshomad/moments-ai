import React, { useState } from 'react';
import { VOICES, generateSpeech } from '../../services/elevenLabsService';
import Spinner from './Spinner';
import { useTheme } from '../../contexts/ThemeContext';

interface NarrationPanelProps {
    onAudioGenerated: (audioUrl: string, audioPrompt: string) => void;
}

const NarrationPanel: React.FC<NarrationPanelProps> = ({ onAudioGenerated }) => {
    const [audioPrompt, setAudioPrompt] = useState('Meet Charlie, our new family wizard!');
    const [selectedVoiceId, setSelectedVoiceId] = useState(VOICES[0].id);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { elevenLabsApiKey } = useTheme();

    const handleGenerate = async () => {
        if (!audioPrompt || isLoading) return;
        
        if (!elevenLabsApiKey) {
            setError("API Key is required. Please add it in the settings menu (⚙️).");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const audioUrl = await generateSpeech(audioPrompt, selectedVoiceId, elevenLabsApiKey);
            onAudioGenerated(audioUrl, audioPrompt);
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Failed to generate audio.';
            if (errorMessage.includes("API key is not configured")) {
                setError("ElevenLabs API key is invalid or not set. Please configure it to use this feature.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-2 text-card-foreground">Add Voice-over</h4>
            <div className="mb-3">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Select a Voice</label>
                <div className="grid grid-cols-2 gap-2">
                    {VOICES.map(voice => (
                        <button
                            key={voice.id}
                            onClick={() => setSelectedVoiceId(voice.id)}
                            className={`p-2 rounded-md text-left transition-all duration-200 border ${selectedVoiceId === voice.id ? 'bg-brand-teal/20 border-brand-teal ring-1 ring-brand-teal' : 'bg-input border-border hover:bg-accent'}`}
                        >
                            <p className="font-bold text-card-foreground text-sm">{voice.name}</p>
                            <p className="text-muted-foreground text-xs">{voice.description}</p>
                        </button>
                    ))}
                </div>
            </div>
            <textarea
                value={audioPrompt}
                onChange={(e) => setAudioPrompt(e.target.value)}
                placeholder="Type your narration here..."
                className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-brand-teal focus:outline-none transition resize-none text-sm"
                rows={3}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading || !audioPrompt}
                className="w-full mt-2 bg-brand-teal text-white font-bold py-2 px-3 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm"
            >
                {isLoading ? <><Spinner /> Generating Audio...</> : 'Generate Audio'}
            </button>
            {error && <p className="text-destructive mt-2 text-xs text-center">{error}</p>}
        </div>
    );
};

export default NarrationPanel;
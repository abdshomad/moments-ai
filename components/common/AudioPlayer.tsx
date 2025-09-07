import React, { useState, useRef, useEffect } from 'react';

const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
    </svg>
);

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', onEnded);
        
        const onPlay = () => setIsPlaying(true);
        audio.addEventListener('play', onPlay);

        const onPause = () => setIsPlaying(false);
        audio.addEventListener('pause', onPause);
        
        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, []);
    
    // Clean up object URL when component unmounts or src changes to prevent memory leaks
    useEffect(() => {
        return () => {
            if (src && src.startsWith('blob:')) {
                URL.revokeObjectURL(src);
            }
        };
    }, [src]);


    return (
        <div className="flex items-center gap-2 p-2 bg-gray-900/70 border-t border-gray-700">
            <audio ref={audioRef} src={src} preload="auto" />
            <button onClick={togglePlayPause} className="text-brand-teal hover:text-white transition-colors" aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <p className="text-xs text-gray-400">Voice-over ready</p>
        </div>
    );
};

export default AudioPlayer;

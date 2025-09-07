import React, { useState } from 'react';
import { GenerationResult } from '../../types';
import IconButton from './IconButton';
import Spinner from './Spinner';
import AudioPlayer from './AudioPlayer';
import NarrationPanel from './NarrationPanel';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { AudioIcon, DownloadIcon, RefineIcon, ShareIcon, VideoIcon, AnimateIcon } from './Icons';

interface ImageCardProps {
  result: GenerationResult;
  isLatest?: boolean;
  onRefine?: () => void;
  onAudioGenerated?: (id: string, audioUrl: string, audioPrompt: string) => void;
  onAnimate?: (id: string, imageUrl: string, prompt: string) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({ result, isLatest = false, onRefine, onAudioGenerated, onAnimate }) => {
  const [isNarrationOpen, setIsNarrationOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { createVideoFile, isProcessing: isGeneratingVideo } = useVideoGeneration(result);

  const hasAudio = !!result.audioUrl;
  const hasVideo = !!result.videoUrl;
  const isActionInProgress = isGeneratingVideo || isSharing || isAnimating;

  const handleAnimate = async () => {
    if (!onAnimate || isAnimating || hasAudio) return;
    setIsAnimating(true);
    try {
        await onAnimate(result.id, result.imageUrl, result.prompt);
    } catch (e) {
        console.error("Animation failed:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred. Please try again.";
        alert(errorMessage);
    } finally {
        setIsAnimating(false);
    }
  };

  const handleDownload = async () => {
    let fileToDownload: File | string | null = result.imageUrl;
    let extension = 'png';
    let mediaType: 'image' | 'video' = 'image';

    if (hasVideo) {
        const response = await fetch(result.videoUrl!);
        const blob = await response.blob();
        fileToDownload = new File([blob], "video.mp4", { type: "video/mp4" });
        extension = 'mp4';
        mediaType = 'video';
    } else if (hasAudio) {
        fileToDownload = await createVideoFile();
        if (fileToDownload) {
            extension = (fileToDownload as File).name.split('.').pop() || 'webm';
            mediaType = 'video';
        }
    }
    
    if (!fileToDownload) return;

    const url = typeof fileToDownload === 'string' ? fileToDownload : URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    const fileName = result.prompt.toLowerCase().replace(/\s+/g, '_').slice(0, 30) || mediaType;
    a.download = `momentsai_${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof fileToDownload !== 'string') URL.revokeObjectURL(url);
  };
  
  const handleShare = async () => {
    if (!navigator.share) {
        alert("Sharing is not supported on your browser. Please download the file instead.");
        return;
    }
    if (isSharing) return;
    setIsSharing(true);
    try {
        let fileToShare: File | undefined;

        if (hasVideo) {
            const response = await fetch(result.videoUrl!);
            const blob = await response.blob();
            fileToShare = new File([blob], `momentsai_share.mp4`, { type: 'video/mp4' });
        } else if (hasAudio) {
            fileToShare = await createVideoFile() ?? undefined;
        } else {
            fileToShare = await fetch(result.imageUrl)
                .then(res => res.blob())
                .then(blob => new File([blob], `momentsai_share.png`, { type: 'image/png' }));
        }

      if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          await navigator.share({ files: [fileToShare], title: 'My MomentsAI Creation', text: result.prompt });
      } else {
           throw new Error("Cannot share this file type on this browser.");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
           console.error('Sharing failed:', error);
           alert('Sharing failed. Please try downloading instead.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const animationMessages = [ "Bringing your moment to life...", "Animating the scene...", "Adding a touch of magic...", "Finalizing the video..." ];
  const [currentMessage, setCurrentMessage] = useState(animationMessages[0]);

  // Fix: Replaced NodeJS.Timeout with an inferred type from setInterval and improved the effect's logic
  // to correctly manage the interval lifecycle. The previous implementation caused a type error in
  // browser environments and could lead to unhandled intervals.
  React.useEffect(() => {
    if (isAnimating) {
        const interval = setInterval(() => {
            setCurrentMessage(prev => {
                const currentIndex = animationMessages.indexOf(prev);
                return animationMessages[(currentIndex + 1) % animationMessages.length];
            });
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [isAnimating]);
  
  const handleAudioGenerated = (audioUrl: string, audioPrompt: string) => {
    if (onAudioGenerated) {
        onAudioGenerated(result.id, audioUrl, audioPrompt);
    }
    setIsNarrationOpen(false);
  }

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300 ${isLatest ? 'border-brand-purple shadow-lg shadow-ring/20' : 'border-border'}`}>
      <div className="relative">
        {hasVideo ? (
             <video src={result.videoUrl} loop autoPlay muted playsInline className="w-full h-auto aspect-square object-cover" />
        ) : (
             <img src={result.imageUrl} alt={result.prompt} className="w-full h-auto aspect-square object-cover" />
        )}
        
        {isAnimating && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                <Spinner />
                <p className="text-white mt-3 font-semibold transition-opacity duration-500">{currentMessage}</p>
            </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <p className="text-sm text-gray-200 line-clamp-3">{result.prompt}</p>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {isLatest && onAnimate && !hasAudio && !hasVideo && <IconButton onClick={handleAnimate} label="Animate this image" disabled={isActionInProgress}><AnimateIcon /></IconButton>}
            {onAudioGenerated && !hasAudio && !hasVideo && <IconButton onClick={() => setIsNarrationOpen(p => !p)} label="Add voice-over" disabled={isActionInProgress}><AudioIcon /></IconButton>}
            {isLatest && onRefine && !hasVideo && <IconButton onClick={onRefine} label="Refine this image" disabled={isActionInProgress}><RefineIcon /></IconButton>}
            {result.imageUrl && (
              <>
                <IconButton onClick={handleShare} disabled={isActionInProgress} label="Share creation">{isSharing ? <Spinner /> : <ShareIcon />}</IconButton>
                <IconButton onClick={handleDownload} disabled={isActionInProgress} label={hasVideo || hasAudio ? "Download Video" : "Download Image"}>{isGeneratingVideo ? <Spinner /> : (hasVideo || hasAudio) ? <VideoIcon /> : <DownloadIcon />}</IconButton>
              </>
            )}
          </div>
          {isLatest && <span className="absolute top-3 left-3 bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full">LATEST</span>}
        </div>
      </div>
      {isNarrationOpen && onAudioGenerated && <NarrationPanel onAudioGenerated={handleAudioGenerated} />}
      {hasAudio && <AudioPlayer src={result.audioUrl!} />}
    </div>
  );
};

export default ImageCard;

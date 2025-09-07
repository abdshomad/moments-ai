import React, { useState } from 'react';
import { GenerationResult } from '../../types';
import IconButton from './IconButton';
import Spinner from './Spinner';
import AudioPlayer from './AudioPlayer';
import NarrationPanel from './NarrationPanel';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { AudioIcon, DownloadIcon, RefineIcon, ShareIcon, VideoIcon } from './Icons';

interface ImageCardProps {
  result: GenerationResult;
  isLatest?: boolean;
  onRefine?: () => void;
  onGenerateAudio?: (id: string, text: string, voiceId: string) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({ result, isLatest = false, onRefine, onGenerateAudio }) => {
  const [isNarrationOpen, setIsNarrationOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { createVideoFile, isProcessing: isGeneratingVideo } = useVideoGeneration(result);

  const hasAudio = !!result.audioUrl;
  const isActionInProgress = isGeneratingVideo || isSharing;

  const handleDownload = async () => {
    const fileToDownload = hasAudio ? await createVideoFile() : result.imageUrl;
    if (!fileToDownload) return;

    const url = typeof fileToDownload === 'string' ? fileToDownload : URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    const fileName = result.prompt.toLowerCase().replace(/\s+/g, '_').slice(0, 30) || (hasAudio ? 'video' : 'image');
    const extension = hasAudio ? (fileToDownload as File).name.split('.').pop() : 'png';
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
      const fileToShare = hasAudio 
        ? await createVideoFile()
        : await fetch(result.imageUrl)
            .then(res => res.blob())
            .then(blob => new File([blob], `momentsai_share.png`, { type: 'image/png' }));

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

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300 ${isLatest ? 'border-brand-purple shadow-lg shadow-ring/20' : 'border-border'}`}>
      <div className="relative">
        <img src={result.imageUrl} alt={result.prompt} className="w-full h-auto aspect-square object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <p className="text-sm text-gray-200 line-clamp-3">{result.prompt}</p>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {onGenerateAudio && !hasAudio && <IconButton onClick={() => setIsNarrationOpen(p => !p)} label="Add voice-over" disabled={isActionInProgress}><AudioIcon /></IconButton>}
            {isLatest && onRefine && <IconButton onClick={onRefine} label="Refine this image" disabled={isActionInProgress}><RefineIcon /></IconButton>}
            {result.imageUrl && (
              <>
                <IconButton onClick={handleShare} disabled={isActionInProgress} label="Share creation">{isSharing ? <Spinner /> : <ShareIcon />}</IconButton>
                <IconButton onClick={handleDownload} disabled={isActionInProgress} label={hasAudio ? "Download Video" : "Download Image"}>{isGeneratingVideo ? <Spinner /> : hasAudio ? <VideoIcon /> : <DownloadIcon />}</IconButton>
              </>
            )}
          </div>
          {isLatest && <span className="absolute top-3 left-3 bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full">LATEST</span>}
        </div>
      </div>
      {isNarrationOpen && onGenerateAudio && <NarrationPanel resultId={result.id} onGenerateAudio={onGenerateAudio} onComplete={() => setIsNarrationOpen(false)} />}
      {hasAudio && <AudioPlayer src={result.audioUrl!} />}
    </div>
  );
};

export default ImageCard;
import { useState } from 'react';
import { GenerationResult } from '../types';

export const useVideoGeneration = (result: GenerationResult) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const createVideoFile = async (): Promise<File | null> => {
        if (!result.audioUrl) return null;
        setIsProcessing(true);
        try {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            const imageLoadPromise = new Promise(resolve => image.onload = resolve);
            image.src = result.imageUrl;
            await imageLoadPromise;

            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            ctx.drawImage(image, 0, 0);
            
            const videoStream = canvas.captureStream(30);

            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            const audioLoadPromise = new Promise(resolve => audio.onloadedmetadata = resolve);
            audio.src = result.audioUrl!;
            await audioLoadPromise;

            const captureStream = (audio as any).captureStream || (audio as any).mozCaptureStream;
            if (!captureStream) throw new Error('captureStream is not supported in this browser.');
            const audioStream = captureStream.call(audio);

            const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);
            
            const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
            const fileExtension = mimeType.split('/')[1];

            const recorder = new MediaRecorder(combinedStream, { mimeType });
            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);

            const recordingStopped = new Promise<void>(resolve => recorder.onstop = () => resolve());
            
            recorder.start();
            audio.play();

            await new Promise<void>(resolve => {
                audio.onended = () => {
                    recorder.stop();
                    videoStream.getTracks().forEach(track => track.stop());
                    audioStream.getAudioTracks().forEach(track => track.stop());
                    resolve();
                };
            });

            await recordingStopped;

            const videoBlob = new Blob(chunks, { type: mimeType });
            const fileName = `momentsai_${result.prompt.toLowerCase().replace(/\s+/g, '_').slice(0, 30) || 'video'}.${fileExtension}`;
            return new File([videoBlob], fileName, { type: mimeType });
        } catch (error) {
            console.error('Error creating video file:', error);
            alert('Could not create video file. Your browser might not support this feature.');
            return null;
        } finally {
            setIsProcessing(false);
        }
    };
    
    return { createVideoFile, isProcessing };
};

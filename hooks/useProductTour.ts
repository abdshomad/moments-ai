
import { useState, useCallback } from 'react';

export const TOUR_STEPS = [
    {
        selector: '[data-tour-id="step-1-mode"]',
        title: '1. Choose Your Mode',
        content: 'Start by enhancing one of your own photos. This is where the magic begins!',
    },
    {
        selector: '[data-tour-id="step-2-upload"]',
        title: '2. Upload Your Photo',
        content: 'Click here to select an image from your device to start editing.',
    },
    {
        selector: '[data-tour-id="step-3-prompt"]',
        title: '3. Describe Your Vision',
        content: 'Use simple words to tell the AI what changes you want to make.',
    },
    {
        selector: '[data-tour-id="step-4-generate"]',
        title: '4. Bring it to Life',
        content: 'Click here to generate your edited image. You can refine it as many times as you like!',
    },
    {
        selector: '[data-tour-id="step-5-results"]',
        title: '5. See Your Creations',
        content: 'Your original image and all your generated edits will appear here. Enjoy!',
    },
];


export const useProductTour = () => {
    const [isTourActive, setIsTourActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const startTour = useCallback(() => {
        const tourCompleted = localStorage.getItem('momentsai_tour_completed');
        if (!tourCompleted) {
            setCurrentStepIndex(0);
            setIsTourActive(true);
        }
    }, []);
    
    const stopTour = useCallback(() => {
        setIsTourActive(false);
        localStorage.setItem('momentsai_tour_completed', 'true');
    }, []);

    const goToNextStep = useCallback(() => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            stopTour();
        }
    }, [currentStepIndex, stopTour]);

    const goToPrevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    return {
        isTourActive,
        currentStepIndex,
        startTour,
        stopTour,
        goToNextStep,
        goToPrevStep,
        currentStep: TOUR_STEPS[currentStepIndex],
    };
};


import React, { useLayoutEffect, useRef, useState } from 'react';
import { TOUR_STEPS } from '../hooks/useProductTour';

interface TourStep {
    selector: string;
    title: string;
    content: string;
}

interface ProductTourProps {
    isTourActive: boolean;
    currentStep: TourStep;
    currentStepIndex: number;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    stopTour: () => void;
}

const ProductTour: React.FC<ProductTourProps> = ({ isTourActive, currentStep, currentStepIndex, goToNextStep, goToPrevStep, stopTour }) => {
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isTourActive || !currentStep) return;
        
        const updatePosition = () => {
            const targetElement = document.querySelector<HTMLElement>(currentStep.selector);
            if (!targetElement) {
                setHighlightStyle({ display: 'none' });
                setTooltipStyle({ display: 'none' });
                return;
            };
            
            const targetRect = targetElement.getBoundingClientRect();
            const margin = 8;
            setHighlightStyle({
                display: 'block',
                top: `${targetRect.top - margin}px`,
                left: `${targetRect.left - margin}px`,
                width: `${targetRect.width + (margin * 2)}px`,
                height: `${targetRect.height + (margin * 2)}px`,
            });
            
            if (tooltipRef.current) {
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                let top = targetRect.bottom + margin;
                let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

                const edgeMargin = 16;
                if (left < edgeMargin) left = edgeMargin;
                if (left + tooltipRect.width > window.innerWidth - edgeMargin) left = window.innerWidth - tooltipRect.width - edgeMargin;
                if (top + tooltipRect.height > window.innerHeight - edgeMargin) {
                     top = targetRect.top - tooltipRect.height - margin;
                }
                if (top < edgeMargin) {
                    top = targetRect.bottom + margin;
                }

                setTooltipStyle({
                    display: 'block',
                    top: `${top}px`,
                    left: `${left}px`,
                    opacity: 1,
                });
            }
        };

        setTooltipStyle({ opacity: 0 }); 
        
        const timeoutId = setTimeout(updatePosition, 50);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updatePosition);
        };

    }, [isTourActive, currentStep]);

    if (!isTourActive) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/70 z-50" onClick={stopTour} />
            <div
                className="absolute bg-transparent rounded-lg border-2 border-brand-purple border-dashed pointer-events-none transition-all duration-300 z-50"
                style={highlightStyle}
            />
            <div
                ref={tooltipRef}
                className="absolute bg-gray-800 p-4 rounded-lg shadow-2xl w-72 transition-all duration-300 z-50"
                style={tooltipStyle}
            >
                 <h3 className="font-bold text-lg text-brand-teal mb-2">{currentStep.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{currentStep.content}</p>
                <div className="flex justify-between items-center">
                    <button onClick={stopTour} className="text-xs text-gray-400 hover:text-white transition-colors">Skip Tour</button>
                    <div className="flex items-center gap-2">
                        {currentStepIndex > 0 && (
                            <button onClick={goToPrevStep} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md">Previous</button>
                        )}
                        <button onClick={goToNextStep} className="text-sm bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold px-4 py-1 rounded-md hover:opacity-90 transition-opacity">
                            {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductTour;



import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
    onDismiss: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the animation shortly after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Allow time for the fade-out animation before calling the parent dismiss function
        setTimeout(onDismiss, 300);
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div 
                className={`bg-card/50 border border-border rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal animate-gradient-x">
                        MomentsAI
                    </span>
                </h1>
                <p className="mt-2 mb-8 text-lg text-muted-foreground">
                    Turn your photos into extraordinary stories.
                </p>
                <button
                    onClick={handleDismiss}
                    className="w-full sm:w-auto bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
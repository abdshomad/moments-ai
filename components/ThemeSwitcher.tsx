import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ThemeSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme, elevenLabsApiKey, setElevenLabsApiKey } = useTheme();
    const [localApiKey, setLocalApiKey] = useState(elevenLabsApiKey || '');
    const [keySaved, setKeySaved] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalApiKey(elevenLabsApiKey || '');
    }, [elevenLabsApiKey]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (newTheme: 'dark' | 'light' | 'banana') => {
        setTheme(newTheme);
    };

    const handleSaveKey = () => {
        setElevenLabsApiKey(localApiKey);
        setKeySaved(true);
        setTimeout(() => setKeySaved(false), 2000); // Hide message after 2s
    };


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Open settings menu"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <SettingsIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-20">
                    <div className="p-2">
                        <button onClick={() => handleThemeChange('dark')} className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md ${theme === 'dark' ? 'text-primary-foreground bg-primary' : 'text-popover-foreground'} hover:bg-accent`}>
                           <span className="mr-2 text-base">⚫️</span> Dark
                        </button>
                        <button onClick={() => handleThemeChange('light')} className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md ${theme === 'light' ? 'text-primary-foreground bg-primary' : 'text-popover-foreground'} hover:bg-accent`}>
                           <span className="mr-2 text-base">⚪️</span> Light
                        </button>
                        <button onClick={() => handleThemeChange('banana')} className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md ${theme === 'banana' ? 'text-primary-foreground bg-primary' : 'text-popover-foreground'} hover:bg-accent`}>
                           <span className="mr-2 text-base">🍌</span> Banana
                        </button>
                    </div>
                    <div className="border-t border-border"></div>
                    <div className="p-3">
                        <label htmlFor="apiKeyInput" className="block text-xs font-medium text-muted-foreground mb-1.5">ElevenLabs API Key</label>
                        <input 
                            id="apiKeyInput"
                            type="password" 
                            value={localApiKey} 
                            onChange={(e) => setLocalApiKey(e.target.value)} 
                            className="w-full p-2 bg-input border border-border rounded-md text-sm focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
                            placeholder="Enter your API key"
                        />
                        <button 
                            onClick={handleSaveKey} 
                            className="w-full mt-2 bg-brand-teal text-white font-bold py-1.5 px-3 rounded-md text-sm hover:opacity-90 transition-opacity"
                        >
                            {keySaved ? 'Saved!' : 'Save Key'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
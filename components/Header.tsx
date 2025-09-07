import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  return (
    <header className="relative text-center py-6">
       <div className="absolute top-4 right-0">
        <ThemeSwitcher />
      </div>
      <h1 className="relative inline-block text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal animate-gradient-x">
          MomentsAI
        </span>
        <span aria-hidden="true" className="absolute top-0 -right-4 text-2xl animate-sparkle-1">✨</span>
        <span aria-hidden="true" className="absolute bottom-0 -right-8 text-xl animate-sparkle-2">💖</span>
        <span aria-hidden="true" className="absolute top-1/2 -left-6 text-2xl animate-sparkle-3">🌟</span>
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Turn your photos into extraordinary stories.
      </p>
    </header>
  );
};

export default Header;
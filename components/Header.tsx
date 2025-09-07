
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-6">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal animate-gradient-x">
          MomentsAI
        </span>
      </h1>
      <p className="mt-3 text-lg text-gray-400">
        Turn your photos into extraordinary stories.
      </p>
    </header>
  );
};

export default Header;

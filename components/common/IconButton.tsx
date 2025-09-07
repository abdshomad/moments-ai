import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, label, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default IconButton;
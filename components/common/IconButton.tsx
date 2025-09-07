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
      className="p-2 rounded-full bg-card/50 hover:bg-card/70 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default IconButton;

import React from 'react';
import { GenerationMode } from '../types';

interface ModeSelectorProps {
  currentMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
}

const ModeButton: React.FC<{
    label: string;
    description: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, description, isActive, onClick }) => {
    const activeClasses = 'border-brand-purple ring-2 ring-brand-purple bg-card/80';
    const inactiveClasses = 'border-border bg-card hover:border-border/80 hover:bg-card/50';

    return (
        <button
            onClick={onClick}
            className={`flex-1 p-6 rounded-xl border text-left transition-all duration-300 transform hover:scale-105 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <h3 className="text-xl font-bold text-card-foreground">{label}</h3>
            <p className="mt-1 text-muted-foreground">{description}</p>
        </button>
    );
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <ModeButton
        label="Create New Scene"
        description="Generate a brand new image from a text prompt."
        isActive={currentMode === GenerationMode.GENERATE}
        onClick={() => onSelectMode(GenerationMode.GENERATE)}
      />
      <div className="flex-1 flex" data-tour-id="step-1-mode">
        <ModeButton
          label="Enhance Existing Photo"
          description="Upload a photo and transform it with your words."
          isActive={currentMode === GenerationMode.EDIT}
          onClick={() => onSelectMode(GenerationMode.EDIT)}
        />
      </div>
    </div>
  );
};

export default ModeSelector;
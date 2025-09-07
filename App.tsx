
import React, { useState } from 'react';
import { GenerationMode } from './types';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.EDIT);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col items-center p-4 selection:bg-brand-purple selection:text-white">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <ModeSelector currentMode={mode} onSelectMode={setMode} />
        <main className="mt-8">
          {mode === GenerationMode.GENERATE && <ImageGenerator />}
          {mode === GenerationMode.EDIT && <ImageEditor />}
        </main>
      </div>
    </div>
  );
};

export default App;

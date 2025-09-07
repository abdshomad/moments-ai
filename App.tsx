
import React, { useState, useEffect } from 'react';
import { GenerationMode } from './types';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import WelcomeScreen from './components/WelcomeScreen';
import ProductTour from './components/ProductTour';
import { useProductTour } from './hooks/useProductTour';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.EDIT);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const tour = useProductTour();

  useEffect(() => {
    const hasVisited = localStorage.getItem('momentsai_has_visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeDismiss = () => {
    localStorage.setItem('momentsai_has_visited', 'true');
    setShowWelcome(false);
    // Start the tour after a short delay for the welcome screen to animate out
    setTimeout(() => {
        tour.startTour();
    }, 500);
  };


  return (
    <>
      {showWelcome && <WelcomeScreen onDismiss={handleWelcomeDismiss} />}
      <ProductTour 
        isTourActive={tour.isTourActive}
        currentStep={tour.currentStep}
        currentStepIndex={tour.currentStepIndex}
        goToNextStep={tour.goToNextStep}
        goToPrevStep={tour.goToPrevStep}
        stopTour={tour.stopTour}
      />
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
    </>
  );
};

export default App;

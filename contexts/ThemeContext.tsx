import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type Theme = 'dark' | 'light' | 'banana';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  elevenLabsApiKey: string | null;
  setElevenLabsApiKey: (key: string | null) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: { children: React.ReactNode, defaultTheme?: Theme }) {
  const themeStorageKey = 'momentsai-theme';
  const apiKeyStorageKey = 'momentsai-elevenlabs-api-key';

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme
  );
  
  const [elevenLabsApiKey, setElevenLabsApiKeyInternal] = useState<string | null>(
    () => localStorage.getItem(apiKeyStorageKey)
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'banana');
    root.classList.add(theme);
    localStorage.setItem(themeStorageKey, theme);
  }, [theme, themeStorageKey]);
  
  const setElevenLabsApiKey = (key: string | null) => {
    setElevenLabsApiKeyInternal(key);
    if (key) {
      localStorage.setItem(apiKeyStorageKey, key);
    } else {
      localStorage.removeItem(apiKeyStorageKey);
    }
  };


  const value = useMemo(() => ({
    theme,
    setTheme,
    elevenLabsApiKey,
    setElevenLabsApiKey,
  }), [theme, elevenLabsApiKey]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
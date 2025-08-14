'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage if available, otherwise use system preference
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Initialize theme on mount only
  useEffect(() => {
    // Get saved theme or detect system preference
    const savedTheme = localStorage.getItem('hustle-theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // Apply theme class whenever theme changes
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  // Store theme choice in localStorage
  const setThemeWithStorage = (newTheme: Theme) => {
    localStorage.setItem('hustle-theme', newTheme);
    setTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeWithStorage }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
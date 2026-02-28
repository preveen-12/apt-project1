import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  const themes = {
    dark: { 
      bg: '#0a0a12',      
      card: '#050509',    
      text: '#ffffff',    
      textDim: '#94a3b8', 
      border: '#1e1e30',
      overlay: 'rgba(255, 255, 255, 0.03)' 
    },
    light: { 
      bg: '#f4f4f9',      
      card: '#ffffff',    
      text: '#0f172a',    
      textDim: '#475569', 
      border: '#d1d5db',
      overlay: 'rgba(0, 0, 0, 0.05)' 
    },
    cyber: { 
      bg: '#000814', 
      card: '#001d3d', 
      text: '#00f5d4', 
      textDim: '#00b4d8',
      border: '#7b2cbf',
      overlay: 'rgba(0, 245, 212, 0.05)'
    }
  };

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const root = document.documentElement;
    const colors = themes[theme];
    
    // Explicitly set each property to ensure the browser re-renders
    root.style.setProperty('--app-bg', colors.bg);
    root.style.setProperty('--app-card', colors.card);
    root.style.setProperty('--app-text', colors.text);
    root.style.setProperty('--app-text-dim', colors.textDim);
    root.style.setProperty('--app-border', colors.border);
    root.style.setProperty('--app-overlay', colors.overlay);
    
    // Adaptive Terminal Colors for visibility
    if (theme === 'light') {
        root.style.setProperty('--terminal-yellow', '#a16207'); 
        root.style.setProperty('--terminal-green', '#15803d');  
        root.style.setProperty('--terminal-red', '#b91c1c');    
    } else {
        root.style.setProperty('--terminal-yellow', '#facc15'); 
        root.style.setProperty('--terminal-green', '#4ade80');  
        root.style.setProperty('--terminal-red', '#f87171');    
    }

    // Force a body background update to override any lingering CSS
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
import { useState, useEffect } from 'react';

const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quizSettings');
    const defaultSettings = {
      theme: 'light',
      sound: true,
      volume: 50,
      fontFamily: 'Inter, sans-serif',
      fontSize: 'medium',
      orientation: 'portrait',
      screenSize: 'medium'
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('quizSettings', JSON.stringify(settings));
    
    // Terapkan theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Terapkan font family
    document.body.style.fontFamily = settings.fontFamily;
    
    // Terapkan font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.body.style.fontSize = fontSizeMap[settings.fontSize];
    
    // Terapkan orientasi
    const appElement = document.getElementById('root');
    if (appElement) {
      if (settings.orientation === 'landscape') {
        appElement.classList.add('landscape-mode');
        appElement.classList.remove('portrait-mode');
        document.body.style.minHeight = '100vh';
        document.body.style.overflowX = 'auto';
      } else {
        appElement.classList.add('portrait-mode');
        appElement.classList.remove('landscape-mode');
        document.body.style.minHeight = '';
        document.body.style.overflowX = '';
      }
    }
    
    // Terapkan screen size
    if (appElement) {
      appElement.classList.remove('screen-small', 'screen-medium', 'screen-large', 'screen-full');
      appElement.classList.add(`screen-${settings.screenSize}`);
    }
    
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, sound: !prev.sound }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };

  return { 
    settings, 
    updateSettings, 
    toggleSound, 
    toggleTheme
  };
};

export default useSettings;
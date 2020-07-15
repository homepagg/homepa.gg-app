import { useContext, useEffect } from 'react';
import { Settings } from '../contexts/SettingsProvider.js';

const Theme = () => {
  const settingsState = useContext(Settings);
  const settings = settingsState.state || {};

  useEffect(() => {
    if (document.getElementById('theme-style')) return;
    const style = document.createElement('style');
    style.id = 'theme-style';
    document.head.appendChild(style);
  }, []);

  const darkStyles = `:root {
    --color-primary: var(--color-light);
    --color-secondary: var(--color-dark);
  }`;

  const lightStyles = `:root {
    --color-primary: var(--color-dark);
    --color-secondary: var(--color-light);
  }`;

  useEffect(() => {
    if (!document.getElementById('theme-style')) return;
    const styles =
      settings.theme === 'dark'
        ? darkStyles
        : settings.theme === 'light'
        ? lightStyles
        : window.matchMedia('(prefers-color-scheme: dark)')
        ? darkStyles
        : lightStyles;

    document.getElementById('theme-style').innerHTML = styles;
  }, [darkStyles, lightStyles, settings]);

  return null;
};

export default Theme;

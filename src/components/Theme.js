import { useContext, useEffect } from 'react';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';

const Theme = () => {
  const sessionState = useContext(Session);
  const session = sessionState.state;
  const settingsState = useContext(Settings);
  const settings = settingsState.state || {};

  const darkStyles = `:root {
    --color-primary: var(--color-light);
    --color-secondary: var(--color-dark);
  }`;

  const lightStyles = `:root {
    --color-primary: var(--color-dark);
    --color-secondary: var(--color-light);
  }`;

  useEffect(() => {
    if (document.getElementById('theme-style')) return;
    const style = document.createElement('style');
    style.id = 'theme-style';
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!document.getElementById('theme-style')) return;
    const styles =
      settings.theme === 'solar' && session.daytime
        ? lightStyles
        : settings.theme === 'solar' && !session.daytime
        ? darkStyles
        : settings.theme === 'dark'
        ? darkStyles
        : settings.theme === 'light'
        ? lightStyles
        : window.matchMedia('(prefers-color-scheme: dark)')
        ? darkStyles
        : lightStyles;
    document.getElementById('theme-style').innerHTML = styles;
  }, [darkStyles, lightStyles, session, settings]);

  return null;
};

export default Theme;

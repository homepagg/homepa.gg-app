import { useContext, useEffect } from 'react';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';

const Theme = () => {
  const sessionState = useContext(Session);
  const { sessionReducer } = sessionState;
  const session = sessionState.state;
  const settingsState = useContext(Settings);
  const settings = settingsState.state;

  useEffect(() => {
    if (document.getElementById('theme-style')) return;
    const style = document.createElement('style');
    style.id = 'theme-style';
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!document.getElementById('theme-style')) return;

    const darkStyles = `:root {
      --color-primary: var(--color-light);
      --color-secondary: var(--color-dark);
    }`;

    const lightStyles = `:root {
      --color-primary: var(--color-dark);
      --color-secondary: var(--color-light);
    }`;

    const isDay =
      settings.theme === 'solar' && session.theme
        ? true
        : settings.theme === 'solar' && !session.theme
        ? true
        : settings.theme === 'dark'
        ? false
        : settings.theme === 'light'
        ? true
        : window.matchMedia('(prefers-color-scheme: dark)')
        ? false
        : true;

    document.getElementById('theme-style').innerHTML = isDay
      ? lightStyles
      : darkStyles;
    sessionReducer({ type: 'SET_THEME', value: isDay ? 'light' : 'dark' });
  }, [sessionReducer, session.theme, settings.theme]);

  return null;
};

export default Theme;

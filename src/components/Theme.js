import React, { useContext, useEffect } from 'react';
import suncalc from 'suncalc';
import { createGlobalStyle } from 'styled-components/macro';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';

const ThemeStyles = createGlobalStyle`
:root {
  --color-primary: var(--color-${(props) =>
    props.theme === 'light' ? 'dark' : 'light'});
  --color-secondary: var(--color-${(props) =>
    props.theme === 'light' ? 'light' : 'dark'});
}`;

const Theme = () => {
  const sessionState = useContext(Session);
  const { sessionReducer } = sessionState;
  const session = sessionState.state;
  const settingsState = useContext(Settings);
  const theme = settingsState.state.theme;

  useEffect(() => {
    if (document.getElementById('theme-style')) return;
    const style = document.createElement('style');
    style.id = 'theme-style';
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    let useTheme = true;

    if (theme === 'solar') {
      const setDay = (latitude, longitude) => {
        const times = suncalc.getTimes(new Date(), latitude, longitude);
        useTheme =
          new Date().getTime() > Date.parse(times.dawn) &&
          new Date().getTime() < Date.parse(times.sunset)
            ? 'light'
            : 'dark';
      };
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDay(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setDay('38', '-122');
        }
      );
    }

    if (theme === 'default')
      useTheme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';

    if (theme === 'light' || theme === 'dark') useTheme = theme;

    sessionReducer({ type: 'SET_THEME', value: useTheme });
  }, [sessionReducer, theme]);

  return <ThemeStyles theme={session.theme} />;
};

export default Theme;

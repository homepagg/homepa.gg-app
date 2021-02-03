import React, { useCallback, useContext, useEffect } from 'react';
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

  const updateSolarTheme = useCallback(() => {
    const isDay = (times) => {
      new Date().getTime() > Date.parse(times.dawn) &&
      new Date().getTime() < Date.parse(times.sunset)
        ? sessionReducer({ type: 'SET_THEME', value: 'light' })
        : sessionReducer({ type: 'SET_THEME', value: 'dark' });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        isDay(
          suncalc.getTimes(
            new Date(),
            pos.coords.latitude,
            pos.coords.longitude
          )
        );
      },
      () => {
        isDay(suncalc.getTimes(new Date(), '38', '-122'));
      }
    );
  }, [sessionReducer]);

  useEffect(() => {
    if (document.getElementById('theme-style')) return;
    const style = document.createElement('style');
    style.id = 'theme-style';
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!theme) return;

    let useTheme;

    switch (theme) {
      case 'default':
        useTheme = window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark';
        break;
      case 'solar':
        useTheme = 'light';
        updateSolarTheme();
        break;
      case 'light':
        useTheme = 'light';
        break;
      case 'dark':
        useTheme = 'dark';
        break;
      default:
        useTheme = 'light';
        break;
    }
    sessionReducer({ type: 'SET_THEME', value: useTheme });
  }, [sessionReducer, theme, updateSolarTheme]);

  return <ThemeStyles theme={session.theme} />;
};

export default Theme;

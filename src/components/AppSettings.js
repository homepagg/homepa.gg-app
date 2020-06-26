import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';

const AppSettings = () => {
  const sessionState = useContext(Session);
  const activeSession = sessionState.state.loggedIn || false;

  const settingsState = useContext(Settings);
  const { settingReducer } = settingsState;
  const settings = settingsState.state || {};

  const [showSettings, setShowSettings] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [theme, setTheme] = useState('default');
  const [favesGroup, setFavesGroup] = useState(true);
  const [favesHide, setFavesHide] = useState(false);

  const updateTheme = (value) => {
    setTheme(value);
    settingReducer({ type: 'SET_THEME', value: value });
  };

  const updateFavsGroup = (value) => {
    setFavesGroup(value);
    settingReducer({ type: 'SET_FAVORITES_GROUP', value: value });
  };

  const updateFavesHide = (value) => {
    setFavesHide(value);
    settingReducer({ type: 'SET_SHOW_FAVORITES', value: value });
  };

  useEffect(() => {
    if (updated || Object.keys(settings).length === 0) return;
    setUpdated(true);
    setTheme(settings.theme);
    setFavesGroup(settings.favesGroup);
    setFavesHide(settings.favesHide);
  }, [settings, updated]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return activeSession ? (
    <>
      <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      {showSettings && (
        <aside>
          <h2>Settings</h2>
          <button onClick={() => setShowSettings(!showSettings)}>
            &times;
          </button>
          <form>
            <fieldset>
              <h3>Theme</h3>
              <label>
                <input
                  checked={theme === 'default'}
                  name="theme"
                  onChange={() => updateTheme('default')}
                  type="radio"
                  value="default"
                />
                <span>System (Default)</span>
              </label>
              <label>
                <input
                  checked={theme === 'dark'}
                  name="theme"
                  onChange={() => updateTheme('dark')}
                  type="radio"
                  value="dark"
                />
                <span>Dark</span>
              </label>
              <label>
                <input
                  checked={theme === 'light'}
                  name="theme"
                  onChange={() => updateTheme('light')}
                  type="radio"
                  value="light"
                />
                <span>Light</span>
              </label>
            </fieldset>
            <fieldset>
              <h3>Favorites</h3>
              <label>
                <input
                  checked={favesGroup}
                  onChange={(event) => updateFavsGroup(event.target.checked)}
                  type="checkbox"
                />
                <span>Show Favorites group</span>
              </label>
              <label>
                <input
                  checked={favesHide}
                  onChange={(event) => updateFavesHide(event.target.checked)}
                  type="checkbox"
                />
                <span>Hide favorites in categories</span>
              </label>
            </fieldset>
            <Link to="/logout">Logout</Link>
          </form>
        </aside>
      )}
    </>
  ) : null;
};

export default AppSettings;

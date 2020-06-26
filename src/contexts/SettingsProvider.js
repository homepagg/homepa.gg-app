import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const accessToken = localStorage.getItem('accessToken');
const initialState = [];

const Settings = createContext(initialState);
const { Provider } = Settings;

const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteSettings = (data) => {
  dbx
    .filesUpload({
      path: '/settings.json',
      contents: JSON.stringify(data),
      mode: 'overwrite',
    })
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = state;

  switch (true) {
    case action.type === 'UPDATE':
      temp = action.settings;
      break;

    case action.type === 'SET_THEME':
      temp.theme = action.value;
      break;

    case action.type === 'SET_SHOW_FAVORITES':
      temp.favesHide = action.value;
      break;

    case action.type === 'SET_FAVORITES_GROUP':
      temp.favesGroup = action.value;
      break;

    default:
      console.error('Settings reducer called unnecessarily.');
  }

  localStorage.setItem('settingsJson', JSON.stringify(temp));

  if (action.type !== 'UPDATE') updateRemoteSettings(temp);

  return { ...temp };
};

const SettingsProvider = ({ children }) => {
  const [state, settingReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, settingReducer }}>{children}</Provider>;
};

export { Settings, SettingsProvider };

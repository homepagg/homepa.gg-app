import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const initialState = {};
const Settings = createContext(initialState);
const { Provider } = Settings;
const accessToken = localStorage.getItem('accessToken');
const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteSettings = (data) => {
  const json = JSON.stringify(data);
  dbx
    .filesUpload({
      path: '/settings.json',
      contents: json,
      mode: 'overwrite',
    })
    .then(() => localStorage.setItem('settingsJSON', json))
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = { ...state };

  switch (true) {
    case action.type === 'SET':
      temp = { ...action.settings };
      localStorage.setItem('settingsJSON', JSON.stringify(temp));
      break;

    case action.type === 'PUSH':
      updateRemoteSettings(temp);
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

  return { ...temp };
};

const SettingsProvider = ({ children }) => {
  const [state, settingsReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, settingsReducer }}>{children}</Provider>;
};

export { Settings, SettingsProvider };

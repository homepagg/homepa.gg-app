import React, { createContext, useReducer } from 'react';

const initialState = [];

const Dropbox = createContext(initialState);
const { Provider } = Dropbox;

const updateFile = (file, data) => {
  dbx
    .filesUpload({ path: `/${file}.json`, contents: data })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  switch (true) {
    case action.type === 'connect':
      return { ...state };

    case action.type === 'update':
      return { ...state };

    case action.type === 'send':
      return { ...state };

    default:
      return { ...state };
  }
};

const DropboxProvider = ({ children }) => {
  const [state, dropboxReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, dropboxReducer }}>{children}</Provider>;
};

export { Dropbox, DropboxProvider };

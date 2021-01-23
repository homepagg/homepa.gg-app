import React, { createContext, useReducer } from 'react';

const initialState = {
  loggedIn: false,
  theme: 'light',
};

const Session = createContext(initialState);
const { Provider } = Session;

const reducer = (state, action) => {
  switch (true) {
    case action.type === 'SET_LOGGED_IN':
      state.loggedIn = action.value;
      return { ...state };

    case action.type === 'SET_THEME':
      state.theme = action.value;
      return { ...state };

    default:
      console.error('Session reducer called unnecessarily.');
      return;
  }
};

const SessionProvider = ({ children }) => {
  const [state, sessionReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, sessionReducer }}>{children}</Provider>;
};

export { Session, SessionProvider };

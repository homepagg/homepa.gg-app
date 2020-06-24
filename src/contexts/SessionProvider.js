import React, { createContext, useReducer } from 'react';

const initialState = {
  loggedIn: false,
};

const Session = createContext(initialState);
const { Provider } = Session;

const reducer = (state, action) => {
  switch (true) {
    case action.type === 'SET':
      return { loggedIn: action.value };

    default:
      console.error('Session reducer called unnecessarily.');
      return { ...state };
  }
};

const SessionProvider = ({ children }) => {
  const [state, sessionReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, sessionReducer }}>{children}</Provider>;
};

export { Session, SessionProvider };

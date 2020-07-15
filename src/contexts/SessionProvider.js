import React, { createContext, useReducer } from 'react';

const initialState = {
  loggedIn: false,
  daytime: true,
};

const Session = createContext(initialState);
const { Provider } = Session;

const reducer = (state, action) => {
  const temp = state;

  switch (true) {
    case action.type === 'SET':
      temp.loggedIn = action.value;
      break;

    case action.type === 'SET_DAYTIME':
      temp.daytime = action.value;
      break;

    default:
      console.error('Session reducer called unnecessarily.');
      break;
  }

  return { ...temp };
};

const SessionProvider = ({ children }) => {
  const [state, sessionReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, sessionReducer }}>{children}</Provider>;
};

export { Session, SessionProvider };

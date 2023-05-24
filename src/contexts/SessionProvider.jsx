import { createContext, useContext, useEffect, useReducer } from 'react';

const reducer = (state, action) => ({ ...state, ...action });

const initialState = {
    logged_in: false,
    theme: 'light',
    access_token: '',
    account_id: '',
    expires_in: '',
    scope: '',
    token_type: '',
    uid: '',
};

export const Session = createContext(initialState);

export const SessionProvider = ({ children }) => {
    const [session, sessionDispatcher] = useReducer(reducer, initialState);
    return (
        <Session.Provider value={{ session, sessionDispatcher }}>
            {children}
        </Session.Provider>
    );
};

export const useSession = () => {
    const sessionState = useContext(Session);
    const { session, sessionDispatcher } = sessionState;

    useEffect(() => {
        if (typeof session.access_token !== 'string') return;
        localStorage.setItem('accessToken', session.access_token);
    }, [session]);

    return { session, sessionDispatcher };
};

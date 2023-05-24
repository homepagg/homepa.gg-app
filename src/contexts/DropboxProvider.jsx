import { createContext, useContext, useReducer } from 'react';
import { Dropbox as DBX } from 'dropbox';

const reducer = (state, action) => ({ ...state, ...action });

const initialState = {
    fn: new DBX({ clientId: '5xp9p5yhgpd6oe9' }),
    access_token: '',
    account_id: '',
    expires_in: '',
    scope: '',
    token_type: '',
    uid: '',
};

export const Dropbox = createContext();

export const DropboxProvider = ({ children }) => {
    const [dropbox, dropboxDispatcher] = useReducer(reducer, initialState);
    return (
        <Dropbox.Provider value={{ dropbox, dropboxDispatcher }}>
            {children}
        </Dropbox.Provider>
    );
};

export const useDropbox = () => {
    const { dropbox, dropboxDispatcher } = useContext(Dropbox);
    return { dropbox, dropboxDispatcher };
};

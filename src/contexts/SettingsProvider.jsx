import { createContext, useContext, useEffect, useReducer } from 'react';

import { useDropbox } from './DropboxProvider';

const initialState = {
    ...(JSON.parse(localStorage.getItem('hgg.settings.data')) || {
        group_faves: true,
        show_faves_category: true,
        show_faves_in_group: false,
        theme: 'solar',
        order: [],
    }),
};

const reducer = (state, action) => ({ ...state, ...action });

export const Settings = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, settingsDispatcher] = useReducer(reducer, initialState);
    const { dropbox } = useDropbox();

    useEffect(() => {
        if (dropbox.access_token === '') return;

        const timer = setTimeout(() => {
            const json = JSON.stringify(settings, null, 2);
            dropbox.fn
                .filesUpload({
                    path: '/settings.json',
                    contents: json,
                    mode: 'overwrite',
                })
                .then(() => localStorage.setItem('bookmarksJSON', json))
                .catch((error) => console.error(error));
        }, 5000);

        return () => clearTimeout(timer);
    }, [dropbox, settings]);

    return (
        <Settings.Provider value={{ settings, settingsDispatcher }}>
            {children}
        </Settings.Provider>
    );
};

export const useSettings = () => {
    const { settings, settingsDispatcher } = useContext(Settings);
    return { settings, settingsDispatcher };
};

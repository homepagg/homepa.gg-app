import { createContext, useContext, useReducer } from 'react';

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

export const Settings = createContext(initialState);

export const SettingsProvider = ({ children }) => {
    const [settings, settingsReducer] = useReducer(reducer, initialState);

    return (
        <Settings.Provider value={{ settings, settingsReducer }}>
            {children}
        </Settings.Provider>
    );
};

export const useSettings = () => {
    const { settings, settingsDispatcher } = useContext(Settings);
    return { settings, settingsDispatcher };
};

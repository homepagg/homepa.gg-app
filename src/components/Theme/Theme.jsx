import { useCallback, useEffect } from 'react';
import suncalc from 'suncalc';

import { useSettings } from '../../contexts/SettingsProvider';

const Theme = () => {
    const { settings } = useSettings();

    // const updateSolarTheme = useCallback(() => {
    //     const isDay = (times) => {
    //         new Date().getTime() > Date.parse(times.dawn) &&
    //         new Date().getTime() < Date.parse(times.sunset)
    //             ? sessionDispatcher({ type: 'SET_THEME', value: 'light' })
    //             : sessionDispatcher({ type: 'SET_THEME', value: 'dark' });
    //     };

    //     navigator.geolocation.getCurrentPosition(
    //         (pos) => {
    //             isDay(
    //                 suncalc.getTimes(
    //                     new Date(),
    //                     pos.coords.latitude,
    //                     pos.coords.longitude
    //                 )
    //             );
    //         },
    //         () => {
    //             isDay(suncalc.getTimes(new Date(), '38', '-122'));
    //         }
    //     );
    // }, [sessionDispatcher]);

    // useEffect(() => {
    //     if (document.getElementById('theme-style')) return;
    //     const style = document.createElement('style');
    //     style.id = 'theme-style';
    //     document.head.appendChild(style);
    // }, []);

    // useEffect(() => {
    //     if (!settings.theme) return;

    //     let useTheme;

    //     switch (settings.theme) {
    //         case 'default':
    //             useTheme = window.matchMedia('(prefers-color-scheme: light)')
    //                 .matches
    //                 ? 'light'
    //                 : 'dark';
    //             break;
    //         case 'solar':
    //             useTheme = 'light';
    //             updateSolarTheme();
    //             break;
    //         case 'light':
    //             useTheme = 'light';
    //             break;
    //         case 'dark':
    //             useTheme = 'dark';
    //             break;
    //         default:
    //             useTheme = 'light';
    //             break;
    //     }
    //     sessionDispatcher({ type: 'SET_THEME', value: useTheme });
    // }, [sessionDispatcher, theme, updateSolarTheme]);

    return (
        <style>
            {`
                :root {
                    --color-primary: var(--color-${
                        settings.theme === 'light' ? 'dark' : 'light'
                    });
                    --color-secondary: var(--color-${
                        settings.theme === 'light' ? 'light' : 'dark'
                    });
                }`}
            ;
        </style>
    );
};

export default Theme;

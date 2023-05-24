import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSession } from '../../contexts/SessionProvider';
import { Settings } from '../../contexts/SettingsProvider';
import Modal from '../Modal/Modal';
import { ReactComponent as LogoutSvg } from '../../images/icons/logout.svg';

import styles from './AppSettings.module.scss';


const themeOptions = [
    { name: 'Solar', type: 'solar' },
    { name: 'Light', type: 'light' },
    { name: 'Dark', type: 'dark' },
    { name: 'System', type: 'default' },
];

const AppSettings = ({ closeModal, showModal }) => {
    const { session } = useSession();

    const settingsState = useContext(Settings);
    const { settingsReducer } = settingsState;
    const settings = settingsState.state;

    const [updated, setUpdated] = useState(false);
    const [theme, setTheme] = useState('default');
    const [group_faves, setgroup_faves] = useState(true);
    const [favesHide, setFavesHide] = useState(false);

    const updateTheme = (value) => {
        setTheme(value);
        settingsReducer({ type: 'SET_THEME', value: value });
    };

    const updateFavsGroup = (value) => {
        setgroup_faves(value);
        settingsReducer({ type: 'SET_FAVORITES_GROUP', value: value });
    };

    const updateFavesHide = (value) => {
        setFavesHide(value);
        settingsReducer({ type: 'SET_SHOW_FAVORITES', value: value });
    };

    useEffect(() => {
        if (updated || Object.keys(settings).length === 0) return;
        setUpdated(true);
        setTheme(settings.theme);
        setgroup_faves(settings.group_faves);
        setFavesHide(settings.favesHide);
    }, [settings, updated]);

    return session.logged_in ? (
        <Modal closeModal={closeModal} isOpen={showModal} title="Settings">
            <form className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <h3 className={styles.title}>Theme</h3>
                    {themeOptions.map((themeOption) => (
                        <label className={styles.theme} key={themeOption.type}>
                            <input
                                className={styles.radio}
                                checked={themeOption.type === theme}
                                name="theme"
                                onChange={() => updateTheme(themeOption.type)}
                                type="radio"
                                value={themeOption.type}
                            />
                            <span>{themeOption.name}</span>
                        </label>
                    ))}
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <h3 className={styles.title}>Favorites</h3>
                    <label className={styles.favorite}>
                        <input
                            className={styles.checkbox}
                            checked={group_faves}
                            onChange={(event) =>
                                updateFavsGroup(event.target.checked)
                            }
                            type="checkbox"
                        />
                        <span>Show Favorites group</span>
                    </label>
                    <label className={styles.favorite}>
                        <input
                            className={styles.checkbox}
                            checked={favesHide}
                            onChange={(event) =>
                                updateFavesHide(event.target.checked)
                            }
                            type="checkbox"
                        />
                        <span>Hide favorites in categories</span>
                    </label>
                </fieldset>
                <Link className={styles.logout} to="/logout">
                    <LogoutSvg />
                    Logout
                </Link>
            </form>
        </Modal>
    ) : (
        <></>
    );
};

export default AppSettings;

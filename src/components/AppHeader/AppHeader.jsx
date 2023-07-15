import React, { useState } from 'react';
import cn from 'classnames';

import { useSession } from '../../contexts/SessionProvider';
import AppSettings from '../AppSettings/AppSettings';
import BookmarkForm from '../BookmarkForm/BookmarkForm';
import { ReactComponent as LogoSvg } from '../../images/letter-logo.svg';
import { ReactComponent as PlusSvg } from '../../images/icons/plus.svg';
import { ReactComponent as SettingsSvg } from '../../images/icons/settings.svg';

import styles from './AppHeader.module.css';

const AppHeader = () => {
    const [addingBookmark, setAddingBookmark] = useState(false);
    const [managingSettings, setManagingSettings] = useState(false);

    const { session } = useSession();

    return (
        <header className={styles.container}>
            <h1 className={styles.title}>
                <LogoSvg className={styles.logo} />
                <span className={styles.tooltip}>Baile</span>
            </h1>
            {session.logged_in && (
                <>
                    <button
                        className={styles.button}
                        onClick={() => setAddingBookmark(true)}
                    >
                        <PlusSvg />
                        <span className={styles.tooltip}>Add Bookmark</span>
                    </button>
                    {addingBookmark && (
                        <BookmarkForm
                            closeModal={() => setAddingBookmark(false)}
                            showModal={addingBookmark}
                        />
                    )}
                    <button
                        className={cn(styles.buton, styles.settings)}
                        onClick={() => setManagingSettings(!managingSettings)}
                    >
                        <SettingsSvg />
                        <span className={styles.tooltip}>Settings</span>
                    </button>
                    <AppSettings
                        closeModal={() => setManagingSettings(false)}
                        showModal={managingSettings}
                    />
                </>
            )}
        </header>
    );
};

export default AppHeader;

import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { Session } from '../contexts/SessionProvider.js';
import AppSettings from './AppSettings';
import BookmarkForm from './BookmarkForm.js';
import { ReactComponent as LetterLogo } from '../images/letter-logo.svg';
import { ReactComponent as PlusSvg } from '../images/icons/plus.svg';
import { ReactComponent as SettingsSvg } from '../images/icons/settings.svg';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [managingSettings, setManagingSettings] = useState(false);

  const sessionState = useContext(Session);
  const activeSession = sessionState.state.loggedIn || false;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <LetterLogo className={styles.logo} />
        <span className={styles.tooltip}>Baile</span>
      </h1>
      {activeSession && (
        <>
          <button
            className={styles.button}
            onClick={() => setAddingBookmark(true)}>
            <PlusSvg />
            <span className={styles.tooltip}>Add Bookmark</span>
          </button>
          <BookmarkForm
            closeModal={() => setAddingBookmark(false)}
            showModal={addingBookmark}
          />
          <button
            className={cx(styles.button, styles.settings)}
            onClick={() => setManagingSettings(!managingSettings)}>
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

import React from 'react';
import styles from './AppHeader.module.css';
import { ReactComponent as BaileLogo } from './../images/baile-logo.svg';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <BaileLogo className={styles.logo} /> <strong>Baile</strong>{' '}
        <span className={styles.define}>
          <em>/BAL-yeh/</em> (n.) Home
        </span>
      </h1>
    </header>
  );
};

export default AppHeader;

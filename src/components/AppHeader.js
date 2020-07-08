import React from 'react';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.logo} />
        <strong>Baile</strong>{' '}
        <span className={styles.define}>
          <em>/BAL-yeh/</em> (n.) Home
        </span>
      </h1>
    </header>
  );
};

export default AppHeader;

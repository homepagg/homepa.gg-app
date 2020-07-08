import React from 'react';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.logo} />
        <span className={styles.tooltip}>Baile</span>
      </h1>
    </header>
  );
};

export default AppHeader;

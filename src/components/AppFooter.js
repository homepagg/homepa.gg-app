import React from 'react';
import styles from './AppFooter.module.css';

const AppFooter = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <strong>Baile</strong> <em>/BAL-yeh/</em> (n.) Home.
      </p>
      <p>
        Made with love by Doug Stewart.{' '}
        <a href="https://github.com/doug-stewart/baile">Check the Git repo</a>.
      </p>
    </footer>
  );
};

export default AppFooter;

import React from 'react';
import styles from './AppFooter.module.css';

const AppFooter = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <strong>Baile was made with love by Doug Stewart.</strong>
        Want to see how it's built?{' '}
        <a href="https://github.com/doug-stewart/baile">
          Check out the Git repo
        </a>
        .
      </p>
    </footer>
  );
};

export default AppFooter;

import React, { useContext, useEffect, useState } from 'react';
import Color from 'color';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import styles from './Bookmark.module.css';

const Bookmark = ({ bookmark, setDraggingNode }) => {
  const favicon = `http://www.google.com/s2/favicons?domain=${bookmark.link}`;
  const color = Color(bookmark.color);
  const [goDark, setGoDark] = useState(false);
  const sessionState = useContext(Session);
  const session = sessionState.state;
  const settingsState = useContext(Settings);
  const settings = settingsState.state;

  useEffect(() => {
    setGoDark(
      settings.theme === 'solar' && session.daytime
        ? false
        : settings.theme === 'solar' && !session.daytime
        ? true
        : settings.theme === 'dark'
        ? true
        : settings.theme === 'light'
        ? false
        : window.matchMedia('(prefers-color-scheme: dark)')
        ? true
        : false
    );
  }, [session.daytime, settings.theme]);

  return (
    <li
      className={styles.bookmark}
      data-bookmark={bookmark.id}
      onDragStart={() => setDraggingNode(bookmark.id)}
      onDragEnd={() => setDraggingNode(null)}
      style={{
        '--bookmark-prime': goDark ? color.lightness(80) : color.lightness(20),
        '--bookmark-second': goDark ? color.lightness(20) : color.lightness(80),
      }}>
      <a className={styles.link} href={bookmark.link} title={bookmark.name}>
        <span className={styles.icon}>
          <img alt="" className={styles.img} src={favicon} />
        </span>
        <span className={styles.text}>{bookmark.name}</span>
      </a>
    </li>
  );
};

export default Bookmark;

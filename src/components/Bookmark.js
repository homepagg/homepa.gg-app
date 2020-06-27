import React from 'react';
import styles from './Bookmark.module.css';

const Bookmark = ({ bookmark, setDraggingNode }) => {
  const favicon = `http://www.google.com/s2/favicons?domain=${bookmark.link}`;

  return (
    <li
      className={styles.bookmark}
      data-bookmark={bookmark.id}
      onDragStart={() => setDraggingNode(bookmark.id)}
      onDragEnd={() => setDraggingNode(null)}>
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

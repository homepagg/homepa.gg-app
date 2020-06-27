import React from 'react';
import styles from './CategoryGroup.module.css';
import Bookmark from './Bookmark';

const CategoryGroup = ({
  name,
  bookmarks,
  setDraggingNode,
  sortable,
  sorting,
}) => {
  const openAll = () =>
    bookmarks.forEach((bookmark) => window.open(bookmark.link));

  return (
    <section className={styles.category}>
      <h2 className={styles.title}>{name}</h2>
      {!sorting && (
        <button className={styles.open} onClick={openAll}>
          Open All
        </button>
      )}
      {sortable && (
        <span className={styles.move} data-sortable-handle>
          ≡
        </span>
      )}
      <ul
        className={styles.bookmarks}
        style={{ display: sorting ? 'none' : '' }}>
        {bookmarks.map((bookmark) => (
          <Bookmark
            key={bookmark.id}
            bookmark={bookmark}
            setDraggingNode={setDraggingNode}
          />
        ))}
      </ul>
    </section>
  );
};

export default CategoryGroup;

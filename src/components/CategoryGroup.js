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
    <section>
      <h2>
        {name} {!sorting && <button onClick={openAll}>Open All</button>}
      </h2>
      {sortable && <button data-sortable-handle>≡</button>}
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

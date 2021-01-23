import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Categories } from '../contexts/CategoriesProvider.js';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import styles from './CategoryGroup.module.css';
import Bookmark from './Bookmark';
import { ReactComponent as ArrowSvg } from '../images/icons/arrow.svg';
import { ReactComponent as MoveSvg } from '../images/icons/move.svg';

const CategoryGroup = ({ id, index, name }) => {
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state;
  const categoriesState = useContext(Categories);
  const { categoriesReducer } = categoriesState;
  const settingsState = useContext(Settings);
  const settings = settingsState.state;
  const handle = useRef(null);
  const [categoryBookmarks, setCategoryBookmarks] = useState([]);

  const [, drop] = useDrop({
    accept: 'group',
    hover(item, monitor) {
      if (!handle.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = handle.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      )
        return;

      categoriesReducer({
        type: 'REORDER',
        drag: dragIndex,
        hover: hoverIndex,
      });
    },
  });

  const [{ isDragging }, drag, container] = useDrag({
    item: { type: 'group', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(handle));

  useEffect(() => {
    if (bookmarks.length === 0 && settings.length === 0) return;

    let filtered = bookmarks
      .filter((bookmark) => bookmark.category === id)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (settings.favesHide)
      filtered = filtered.filter((bookmark) => bookmark.favorite === false);

    setCategoryBookmarks(filtered);
  }, [id, bookmarks, settings]);

  const openAll = () =>
    bookmarks.forEach((bookmark) => window.open(bookmark.link));

  return (
    <section ref={container} className={styles.category}>
      <header ref={handle} className={styles.header}>
        <h2 className={styles.title}>{name}</h2>
        {!isDragging && (
          <button className={styles.open} onClick={openAll}>
            Open All
            <ArrowSvg />
          </button>
        )}
        <span className={styles.move} data-sortable-handle>
          <MoveSvg />
        </span>
      </header>
      <ul className={styles.bookmarks}>
        {categoryBookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </ul>
    </section>
  );
};

export default CategoryGroup;

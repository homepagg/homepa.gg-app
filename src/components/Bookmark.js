import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useDrag } from 'react-dnd';
import Color from 'color';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Session } from '../contexts/SessionProvider.js';
import BookmarkForm from './BookmarkForm.js';
import styles from './Bookmark.module.css';

const Bookmark = ({ bookmark }) => {
  const sessionState = useContext(Session);
  const session = sessionState.state;
  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [accentColor, setAccentColor] = useState('');
  const container = useRef();

  const [{ isDragging }, containerRef] = useDrag({
    item: { bookmark, type: 'bookmark' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult?.type === 'edit') setAddingBookmark(true);
      if (item && dropResult?.type === 'delete')
        bookmarksReducer({ type: 'EDIT', id: bookmark.id });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  containerRef(container);

  useEffect(() => {
    if (!container.current) return;

    let color;

    switch (session.theme) {
      case 'light':
        color = Color(bookmark.color).lightness(84);
        break;
      case 'dark':
        color = Color(bookmark.color).lightness(24);
        break;
      default:
        color = Color(bookmark.color);
    }

    const hsl = color.hsl().object();

    setAccentColor(
      `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
    );
  }, [bookmark.color, container, session.theme]);

  return (
    <>
      <li
        className={cx(styles.bookmark, { [styles.isDragging]: isDragging })}
        draggable="true"
        ref={container}
        style={{ '--accent-color': `${accentColor}` }}>
        <a
          className={styles.link}
          href={bookmark.link}
          rel="nofollow noopener"
          title={bookmark.name}>
          <span className={styles.icon}>
            <img
              alt=""
              className={styles.img}
              src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
            />
          </span>
          <span className={styles.text}>{bookmark.name}</span>
        </a>
      </li>
      <BookmarkForm
        bookmarkId={bookmark.id}
        closeModal={() => setAddingBookmark(false)}
        showModal={addingBookmark}
      />
    </>
  );
};

export default Bookmark;

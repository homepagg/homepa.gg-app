import React, { useContext, useEffect, useState } from 'react';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import styles from './CategoryGroup.module.css';
import Bookmark from './Bookmark';
import { ReactComponent as ArrowSvg } from '../images/icons/arrow.svg';

const FavoritesGroup = () => {
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (bookmarks.length === 0) return;

    setFavorites(
      bookmarks
        .filter((bookmark) => bookmark.favorite)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [bookmarks]);

  const openAll = () =>
    bookmarks.forEach((bookmark) => window.open(bookmark.link));

  return (
    <section className={styles.category}>
      <header className={styles.header}>
        <h2 className={styles.title}>Favorites</h2>
        <button className={styles.open} onClick={openAll}>
          Open All
          <ArrowSvg />
        </button>
      </header>
      <ul className={styles.bookmarks}>
        {favorites.map((favorite) => (
          <Bookmark key={favorite.id} bookmark={favorite} />
        ))}
      </ul>
    </section>
  );
};

export default FavoritesGroup;

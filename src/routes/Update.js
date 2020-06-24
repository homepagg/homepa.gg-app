import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from 'react-router-dom';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';

const Update = () => {
  const accessToken = localStorage.getItem('accessToken');

  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const bookmarks = bookmarksState.state.bookmarks || [];

  const categoriesState = useContext(Categories);
  const { categoryReducer } = categoriesState;
  const categories = categoriesState.state.categories || [];

  const [grabbing, setGrabbing] = useState(false);
  const [grabError, setGrabError] = useState(false);
  const [hasBookmarks, setHasBookmarks] = useState(false);
  const [hasDropbox, setHasDropbox] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);

  const updateSettings = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/settings.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener(
          'loadend',
          () => console.log(reader.result)
          // setSettings(JSON.parse(reader.result))
        );
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        console.error('Unable to grab "settings.json":', error);
        setGrabError(true);
      });
  }, [accessToken]);

  const updateCategories = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/categories.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          categoryReducer({
            type: 'UPDATE',
            categories: JSON.parse(reader.result),
          });
        });
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        console.error('Unable to grab "categories.json":', error);
        setGrabError(true);
      });
  }, [accessToken, categoryReducer]);

  const updateBookmarks = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/bookmarks.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          bookmarksReducer({
            type: 'UPDATE',
            bookmarks: JSON.parse(reader.result),
          });
        });
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        console.error('Unable to grab "bookmarks.json":', error);
        setGrabError(true);
      });
  }, [accessToken, bookmarksReducer]);

  const checkRevisions = useCallback(() => {
    console.log('checking');
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesListFolder({ path: '' })
      .then(function (response) {
        setHasDropbox(true);

        const settings = response.entries.filter(
          (entry) => entry.name === 'settings.json'
        )[0].rev;

        const categories = response.entries.filter(
          (entry) => entry.name === 'categories.json'
        )[0].rev;

        const bookmarks = response.entries.filter(
          (entry) => entry.name === 'bookmarks.json'
        )[0].rev;

        if (localStorage.getItem('settingsRevision') !== settings) {
          localStorage.setItem('settingsRevision', settings);
          updateSettings();
        }

        if (localStorage.getItem('categoriesRevision') !== categories)
          localStorage.setItem('categoriesRevision', categories);

        if (
          localStorage.getItem('categoriesJson') !==
          ('null' || 'undefined' || '')
        ) {
          console.log('categories: in local storage');
          const categories = JSON.parse(localStorage.getItem('categoriesJson'));
          categoryReducer({
            type: 'UPDATE',
            categories: categories,
          });
        } else {
          console.log('categories: needed to update');
          updateCategories();
        }

        if (localStorage.getItem('bookmarksRevision') !== bookmarks)
          localStorage.setItem('bookmarksRevision', bookmarks);

        if (
          localStorage.getItem('bookmarksJson') !==
          ('null' || 'undefined' || '')
        ) {
          console.log('bookmarks: in local storage');
          const bookmarks = JSON.parse(localStorage.getItem('bookmarksJson'));
          bookmarksReducer({
            type: 'UPDATE',
            bookmarks: bookmarks,
          });
        } else {
          console.log('bookmarks: needed to update');
          updateBookmarks();
        }
      })
      .catch(function (error) {
        console.error('Unable to access Dropbox:', error);
        setGrabError(true);
      });
  }, [
    accessToken,
    bookmarksReducer,
    categoryReducer,
    updateBookmarks,
    updateCategories,
    updateSettings,
  ]);

  useEffect(() => {
    setHasBookmarks(bookmarks.length > 0);
  }, [bookmarks]);

  useEffect(() => {
    setHasCategories(categories.length > 0);
  }, [categories]);

  useEffect(() => {
    if (grabbing) return;
    setGrabbing(true);
    checkRevisions();
  }, [checkRevisions, grabbing]);

  return hasDropbox && hasBookmarks && hasCategories ? (
    <Redirect to="/" />
  ) : grabError ? (
    <Redirect to="/error" />
  ) : (
    <>
      <h2>Setting the bits&hellip;</h2>
      <dl>
        <dt>Dropbox</dt>
        <dd>
          {hasDropbox ? (
            <span aria-label="Yarp" role="img">
              ✅
            </span>
          ) : (
            <span aria-label="Narp" role="img">
              ❌
            </span>
          )}
        </dd>
        <dt>Settings</dt>
        <dd>
          <span aria-label="Shrug" role="img">
            ❓
          </span>
        </dd>
        <dt>Categories</dt>
        <dd>
          {hasCategories ? (
            <span aria-label="Yarp" role="img">
              ✅
            </span>
          ) : (
            <span aria-label="Narp" role="img">
              ❌
            </span>
          )}
        </dd>
        <dt>Bookmarks</dt>
        <dd>
          {hasBookmarks ? (
            <span aria-label="Yarp" role="img">
              ✅
            </span>
          ) : (
            <span aria-label="Narp" role="img">
              ❌
            </span>
          )}
        </dd>
      </dl>
    </>
  );
};

export default Update;

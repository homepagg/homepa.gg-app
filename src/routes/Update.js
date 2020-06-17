import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from 'react-router-dom';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';

const Update = () => {
  const accessToken = localStorage.getItem('accessToken');

  const bookmarksState = useContext(Bookmarks);
  const categoriesState = useContext(Categories);
  const { bookmarksReducer } = bookmarksState;
  const { categoryReducer } = categoriesState;

  const [grabError, setGrabError] = useState(false);
  const [hasBookmarks, setHasBookmarks] = useState(false);
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
        setGrabError(true);
        console.error(error);
      });
  }, [accessToken]);

  const updateCategories = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/categories.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          setHasCategories(true);
          categoryReducer({
            type: 'UPDATE',
            categories: JSON.parse(reader.result),
          });
        });
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        setGrabError(true);
        console.error(error);
      });
  }, [accessToken, categoryReducer]);

  const updateBookmarks = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/bookmarks.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          setHasBookmarks(true);
          bookmarksReducer({
            type: 'UPDATE',
            bookmarks: JSON.parse(reader.result),
          });
        });
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        setGrabError(true);
        console.error(error);
      });
  }, [accessToken, bookmarksReducer]);

  const checkRevisions = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesListFolder({ path: '' })
      .then(function (response) {
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

        if (
          localStorage.getItem('categoriesRevision') !== categories &&
          localStorage.getItem('categoriesJson')
        ) {
          localStorage.setItem('categoriesRevision', categories);
          updateCategories();
        } else {
          const categories = JSON.parse(localStorage.getItem('categoriesJson'));
          categoryReducer({
            type: 'UPDATE',
            categories: categories,
          });
          setHasCategories(true);
        }

        if (
          localStorage.getItem('bookmarksRevision') !== bookmarks &&
          localStorage.getItem('bookmarksJson')
        ) {
          localStorage.setItem('bookmarksRevision', bookmarks);
          updateBookmarks();
        } else {
          const bookmarks = JSON.parse(localStorage.getItem('bookmarksJson'));
          bookmarksReducer({
            type: 'UPDATE',
            bookmarks: bookmarks,
          });
          setHasBookmarks(true);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [accessToken, updateSettings, updateCategories, updateBookmarks]);

  useEffect(() => {
    checkRevisions();
  }, []);

  return hasBookmarks && hasCategories ? (
    <Redirect to="/" />
  ) : grabError ? (
    <Redirect to="/error" />
  ) : (
    <h2>Setting the bits&hellip;</h2>
  );
};

export default Update;

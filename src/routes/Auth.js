import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Dropbox } from 'dropbox';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';

const Auth = () => {
  const [accessToken, setAccessToken] = useState('');
  const [hasToken, setHasToken] = useState(false);

  const bookmarksState = useContext(Bookmarks);
  const categoriesState = useContext(Categories);
  const { bookmarksReducer } = bookmarksState;
  const { categoryReducer } = categoriesState;

  const getDropboxAuthCode = () => {
    const dbx = new Dropbox({ clientId: '5xp9p5yhgpd6oe9' });
    return dbx.getAuthenticationUrl(`${window.location}`);
  };

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
      .catch((error) => console.error(error));
  }, [accessToken]);

  const updateCategories = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/categories.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () =>
          categoryReducer({
            type: 'UPDATE',
            categories: JSON.parse(reader.result),
          })
        );
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => console.error(error));
  }, [accessToken, categoryReducer]);

  const updateBookmarks = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/bookmarks.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () =>
          bookmarksReducer({
            type: 'UPDATE',
            bookmarks: JSON.parse(reader.result),
          })
        );
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => console.error(error));
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
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [accessToken, updateSettings, updateCategories, updateBookmarks]);

  useEffect(() => {
    const getToken = () => {
      const hashObj = {};

      window.location.hash
        .replace('#', '')
        .split('&')
        .forEach((item) => {
          hashObj[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
        });

      if (hashObj.access_token) {
        setAccessToken(hashObj.access_token);
      } else {
        window.open(getDropboxAuthCode());
      }
    };

    if (localStorage.getItem('accessToken')) {
      setAccessToken(localStorage.getItem('accessToken'));
    } else {
      getToken();
    }
  }, []);

  useEffect(() => {
    if (!accessToken || accessToken === '' || accessToken === 'undefined')
      return;
    localStorage.setItem('accessToken', accessToken);
    checkRevisions();
    setHasToken(true);
  }, [accessToken, checkRevisions]);

  return hasToken ? <Redirect to="/" /> : <h2>Grabbing the bits&hellip;</h2>;
};

export default Auth;

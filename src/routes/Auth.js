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
    return dbx.getAuthenticationUrl(`${window.location}auth`);
  };

  const loadFiles = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    // dbx
    //   .filesDownload({ path: '/settings.json' })
    //   .then((response) => {
    //     const reader = new FileReader();
    //     reader.addEventListener('loadend', () => setSettings(JSON.parse(reader.result)));
    //     reader.readAsText(response.fileBlob);
    //   })
    //   .catch((error) => console.error(error));

    dbx
      .filesDownload({ path: '/categories.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () =>
          categoryReducer({
            type: 'update',
            categories: JSON.parse(reader.result),
          })
        );
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => console.error(error));

    dbx
      .filesDownload({ path: '/bookmarks.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () =>
          bookmarksReducer({
            type: 'update',
            bookmarks: JSON.parse(reader.result),
          })
        );
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => console.error(error));
  }, [accessToken, bookmarksReducer, categoryReducer]);

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
        getDropboxAuthCode();
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
    window.localStorage.setItem('accessToken', accessToken);
    loadFiles();
    setHasToken(true);
  }, [accessToken, loadFiles]);

  return hasToken ? <Redirect to="/" /> : <h2>Grabbing the bits&hellip;</h2>;
};

export default Auth;

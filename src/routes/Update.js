import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from 'react-router-dom';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';

const Update = () => {
  const accessToken = localStorage.getItem('accessToken');

  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const bookmarks = bookmarksState.state.bookmarks || [];

  const categoriesState = useContext(Categories);
  const { categoryReducer } = categoriesState;
  const categories = categoriesState.state.categories || [];

  const sessionState = useContext(Session);
  const { sessionReducer } = sessionState;
  const isReady = sessionState.state.loggedIn || false;

  const settingsState = useContext(Settings);
  const { settingReducer } = settingsState;
  const settings = settingsState.state || {};

  const [grabbing, setGrabbing] = useState(false);
  const [grabError, setGrabError] = useState(false);
  const [hasBookmarks, setHasBookmarks] = useState(false);
  const [hasDropbox, setHasDropbox] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [hasSettings, setHasSettings] = useState(false);

  const updateSettings = useCallback(() => {
    const dbx = new Dropbox({ accessToken, fetch });

    dbx
      .filesDownload({ path: '/settings.json' })
      .then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          settingReducer({
            type: 'UPDATE',
            settings: JSON.parse(reader.result),
          });
        });
        reader.readAsText(response.fileBlob);
      })
      .catch((error) => {
        console.error('Unable to grab "settings.json":', error);
        setGrabError(true);
      });
  }, [accessToken, settingReducer]);

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

        if (
          localStorage.getItem('settingsJson') &&
          localStorage.getItem('settingsJson').startsWith('{"settings":[{')
        ) {
          const settings = JSON.parse(localStorage.getItem('settingsJson'));
          settingReducer({ type: 'UPDATE', settings: settings });
        } else {
          updateSettings();
        }

        if (localStorage.getItem('categoriesRevision') !== categories)
          localStorage.setItem('categoriesRevision', categories);

        if (
          localStorage.getItem('categoriesJson') &&
          localStorage.getItem('categoriesJson').startsWith('{"categories":[{')
        ) {
          const categories = JSON.parse(localStorage.getItem('categoriesJson'));
          categoryReducer({ type: 'UPDATE', categories: categories });
        } else {
          updateCategories();
        }

        if (localStorage.getItem('bookmarksRevision') !== bookmarks)
          localStorage.setItem('bookmarksRevision', bookmarks);

        if (
          localStorage.getItem('bookmarksJson') &&
          localStorage.getItem('bookmarksJson').startsWith('{"bookmarks":[{')
        ) {
          const bookmarks = JSON.parse(localStorage.getItem('bookmarksJson'));
          bookmarksReducer({ type: 'UPDATE', bookmarks: bookmarks });
        } else {
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
    settingReducer,
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
    setHasSettings(Object.keys(settings).length > 0);
  }, [settings]);

  useEffect(() => {
    if (grabbing) return;
    setGrabbing(true);
    checkRevisions();
  }, [checkRevisions, grabbing]);

  useEffect(() => {
    if (hasBookmarks && hasCategories && hasDropbox && hasSettings)
      sessionReducer({ type: 'SET', value: true });
  }, [hasBookmarks, hasCategories, hasDropbox, hasSettings, sessionReducer]);

  return isReady ? (
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
          {hasSettings ? (
            <span aria-label="Yarp" role="img">
              ✅
            </span>
          ) : (
            <span aria-label="Narp" role="img">
              ❌
            </span>
          )}
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

import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Dropbox } from 'dropbox';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import styles from './Setup.module.css';

const Setup = () => {
  const accessToken = localStorage.getItem('accessToken');
  const dbx = new Dropbox({ accessToken, fetch });

  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;

  const categoriesState = useContext(Categories);
  const { categoriesReducer } = categoriesState;

  const sessionState = useContext(Session);
  const { sessionReducer } = sessionState;

  const settingsState = useContext(Settings);
  const { settingsReducer } = settingsState;

  const [status, setStatus] = useState('idle');
  const [hasBookmarks, setHasBookmarks] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [hasSettings, setHasSettings] = useState(false);

  useEffect(() => {
    if (!accessToken || hasBookmarks) return;

    const localBookmarksVersion = localStorage.getItem('bookmarksVersion');
    const localBookmarksJSON = JSON.parse(
      localStorage.getItem('bookmarksJSON')
    );

    if (!!localBookmarksJSON) {
      bookmarksReducer({ type: 'SET', bookmarks: localBookmarksJSON });
      setHasBookmarks(true);
    }

    dbx
      .filesGetMetadata({ path: '/bookmarks.json' })
      .then((response) => {
        if (localBookmarksVersion === response.rev) {
          setHasBookmarks(true);
        } else {
          dbx
            .filesDownload({ path: '/bookmarks.json' })
            .then((response) => {
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                setHasBookmarks(true);
                localStorage.setItem('bookmarksVersion', response.rev);
                bookmarksReducer({
                  type: 'SET',
                  bookmarks: JSON.parse(reader.result),
                });
              });
              reader.readAsText(response.fileBlob);
            })
            .catch((error) => {
              setStatus('error');
              throw Error(
                'failed to fetch `bookmarks.json` for server update',
                error
              );
            });
        }
      })
      .catch((error) => {
        setStatus('error');
        throw Error(
          'failed to fetch `bookmarks.json` for revision check',
          error
        );
      });
  }, [accessToken, dbx, hasBookmarks, bookmarksReducer]);

  useEffect(() => {
    if (!accessToken || hasCategories) return;

    const localCategoriesVersion = localStorage.getItem('categoriesVersion');
    const localCategoriesJSON = JSON.parse(
      localStorage.getItem('categoriesJSON')
    );

    if (!!localCategoriesJSON) {
      categoriesReducer({ type: 'SET', categories: localCategoriesJSON });
      setHasCategories(true);
    }

    dbx
      .filesGetMetadata({ path: '/categories.json' })
      .then((response) => {
        if (localCategoriesVersion === response.rev) {
          setHasCategories(true);
        } else {
          dbx
            .filesDownload({ path: '/categories.json' })
            .then((response) => {
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                setHasCategories(true);
                localStorage.setItem('categoriesVersion', response.rev);
                categoriesReducer({
                  type: 'SET',
                  categories: JSON.parse(reader.result),
                });
              });
              reader.readAsText(response.fileBlob);
            })
            .catch((error) => {
              setStatus('error');
              throw Error(
                'failed to fetch `categories.json` for server update',
                error
              );
            });
        }
      })
      .catch((error) => {
        setStatus('error');
        throw Error(
          'failed to fetch `categories.json` for revision check',
          error
        );
      });
  }, [accessToken, dbx, hasCategories, categoriesReducer]);

  useEffect(() => {
    if (!accessToken || hasSettings) return;

    const localSettingsVersion = localStorage.getItem('settingsVersion');
    const localSettingsJSON = JSON.parse(localStorage.getItem('settingsJSON'));

    if (!!localSettingsJSON) {
      settingsReducer({ type: 'SET', settings: localSettingsJSON });
      setHasSettings(true);
    }

    dbx
      .filesGetMetadata({ path: '/settings.json' })
      .then((response) => {
        if (localSettingsVersion === response.rev) {
          setHasSettings(true);
        } else {
          dbx
            .filesDownload({ path: '/settings.json' })
            .then((response) => {
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                setHasSettings(true);
                localStorage.setItem('settingsVersion', response.rev);
                settingsReducer({
                  type: 'SET',
                  settings: JSON.parse(reader.result),
                });
              });
              reader.readAsText(response.fileBlob);
            })
            .catch((error) => {
              setStatus('error');
              throw Error(
                'failed to fetch `settings.json` for server update',
                error
              );
            });
        }
      })
      .catch((error) => {
        setStatus('error');
        throw Error(
          'failed to fetch `settings.json` for revision check',
          error
        );
      });
  }, [accessToken, dbx, hasSettings, settingsReducer]);

  useEffect(() => {
    if ((hasBookmarks, hasCategories, hasSettings))
      sessionReducer({ type: 'SET_LOGGED_IN', value: true });
  }, [sessionReducer, hasBookmarks, hasCategories, hasSettings]);

  return status === 'loading' ? (
    <aside className={styles.aside}>
      <h2>Setting the bits&hellip;</h2>
      <dl>
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
    </aside>
  ) : status === 'error' ? (
    <Redirect to="/error" />
  ) : null;
};

export default Setup;

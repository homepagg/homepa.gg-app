import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const accessToken = window.localStorage.getItem('accessToken');
const initialState = [];

const Bookmarks = createContext(initialState);
const { Provider } = Bookmarks;

const updateRemoteBookmarks = (data) => {
  const dbx = new Dropbox({ accessToken, fetch });
  dbx
    .filesUpload({
      path: '/bookmarks.json',
      contents: JSON.stringify(data),
      mode: 'overwrite',
    })
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = state;

  switch (true) {
    case action.type === 'update':
      temp = action.bookmarks;
      break;

    case action.type === 'add':
      temp.bookmarks.push({
        id: state.bookmarks[state.bookmarks.length - 1].id + 1,
        name: action.name,
        link: action.link,
        category: action.category,
      });
      break;

    case action.type === 'remove':
      temp.bookmarks.splice(action.id, 1);
      break;

    default:
      console.error('Bookmark reducer called unnecessarily.');
  }

  if (state === temp) updateRemoteBookmarks(temp);
  return { ...temp };
};

const BookmarksProvider = ({ children }) => {
  const [state, bookmarksReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, bookmarksReducer }}>{children}</Provider>;
};

export { Bookmarks, BookmarksProvider };

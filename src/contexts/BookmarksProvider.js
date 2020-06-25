import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const accessToken = localStorage.getItem('accessToken');
const initialState = [];

const Bookmarks = createContext(initialState);
const { Provider } = Bookmarks;

const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteBookmarks = (data) => {
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
    case action.type === 'UPDATE':
      temp = action.bookmarks;
      break;

    case action.type === 'ADD':
      temp.bookmarks.push({
        id: state.bookmarks[state.bookmarks.length - 1].id + 1,
        name: action.name,
        link: action.link,
        category: action.category,
        favorite: action.favorite,
      });
      break;

    case action.type === 'EDIT':
      const bookmark = state.bookmarks
        .map((node) => node.id)
        .indexOf(action.id);
      temp.bookmarks[bookmark] = {
        id: action.id,
        name: action.name,
        link: action.link,
        category: action.category,
        favorite: action.favorite,
      };
      break;

    case action.type === 'REMOVE':
      const index = state.bookmarks.map((node) => node.id).indexOf(action.id);
      temp.bookmarks.splice(index, 1);
      break;

    default:
      console.error('Bookmark reducer called unnecessarily.');
  }

  localStorage.setItem('bookmarksJson', JSON.stringify(temp));

  if (state === temp) updateRemoteBookmarks(temp);

  return { ...temp };
};

const BookmarksProvider = ({ children }) => {
  const [state, bookmarksReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, bookmarksReducer }}>{children}</Provider>;
};

export { Bookmarks, BookmarksProvider };

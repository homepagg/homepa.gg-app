import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const initialState = [];
const Bookmarks = createContext(initialState);
const { Provider } = Bookmarks;
const accessToken = localStorage.getItem('accessToken');
const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteBookmarks = (data) => {
  const json = JSON.stringify(data);
  dbx
    .filesUpload({
      path: '/bookmarks.json',
      contents: json,
      mode: 'overwrite',
    })
    .then(() => localStorage.setItem('bookmarksJSON', json))
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = [...state];

  switch (true) {
    case action.type === 'SET':
      temp = [...action.bookmarks];
      localStorage.setItem('bookmarksJSON', JSON.stringify(temp));
      break;

    case 'PUSH':
      updateRemoteBookmarks(temp);
      break;

    case action.type === 'ADD':
      temp.push({
        id: temp[temp.length - 1].id + 1,
        name: action.name,
        link: action.link,
        category: action.category,
        color: action.color,
        favorite: action.favorite,
      });
      break;

    case action.type === 'EDIT':
      const bookmark = temp.map((node) => node.id).indexOf(action.id);
      temp[bookmark] = {
        id: action.id,
        name: action.name,
        link: action.link,
        category: action.category,
        color: action.color,
        favorite: action.favorite,
      };
      break;

    case action.type === 'REMOVE':
      const index = temp.map((node) => node.id).indexOf(action.id);
      temp.bookmarks.splice(index, 1);
      break;

    default:
      console.error('Bookmark reducer called unnecessarily.', state, action);
  }

  return [...temp];
};

const BookmarksProvider = ({ children }) => {
  const [state, bookmarksReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, bookmarksReducer }}>{children}</Provider>;
};

export { Bookmarks, BookmarksProvider };

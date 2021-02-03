import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const initialState = [];
const Categories = createContext(initialState);
const { Provider } = Categories;
const accessToken = localStorage.getItem('accessToken');
const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteCategories = (data) => {
  const json = JSON.stringify(data);
  dbx
    .filesUpload({
      path: '/categories.json',
      contents: json,
      mode: 'overwrite',
    })
    .then(() => localStorage.setItem('categoriesJSON', json))
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = [...state];

  switch (action.type) {
    case 'SET':
      temp = [...action.categories];
      localStorage.setItem('categoriesJSON', JSON.stringify(temp));
      break;

    case 'UPDATE_REMOTE':
      updateRemoteCategories(temp);
      break;

    case 'REORDER':
      const item = temp.splice(action.drag, 1)[0];
      temp.splice(action.hover, 0, item);
      break;

    case 'ADD':
      temp.push({
        id: state.categories[state.categories.length - 1].id + 1,
        order: state.categories[state.categories.length - 1].order + 1,
        name: action.name,
      });
      break;

    case 'REMOVE':
      temp.splice(action.id, 1);
      break;

    default:
      console.error('Category reducer called unnecessarily.', state, action);
  }

  return [...temp];
};

const CategoriesProvider = ({ children }) => {
  const [state, categoriesReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, categoriesReducer }}>{children}</Provider>;
};

export { Categories, CategoriesProvider };

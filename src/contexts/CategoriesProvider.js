import React, { createContext, useReducer } from 'react';
import { Dropbox } from 'dropbox';

const accessToken = localStorage.getItem('accessToken');
const initialState = [];

const Categories = createContext(initialState);
const { Provider } = Categories;

const dbx = new Dropbox({ accessToken, fetch });

const updateRemoteCategories = (data) => {
  dbx
    .filesUpload({
      path: '/categories.json',
      contents: JSON.stringify(data),
      mode: 'overwrite',
    })
    .catch((error) => console.error(error));
};

const reducer = (state, action) => {
  let temp = state;

  switch (true) {
    case action.type === 'UPDATE':
      temp = action.categories;
      break;

    case action.type === 'ADD':
      temp.categories.push({
        id: state.categories[state.categories.length - 1].id + 1,
        order: state.categories[state.categories.length - 1].order + 1,
        name: action.name,
      });
      break;

    case action.type === 'REMOVE':
      temp.categories.splice(action.id, 1);
      break;

    default:
      console.error('Category reducer called unnecessarily.');
  }

  localStorage.setItem('categoriesJson', JSON.stringify(temp));

  if (state !== temp && state.length !== 0) updateRemoteCategories(temp);

  return { ...temp };
};

const CategoriesProvider = ({ children }) => {
  const [state, categoryReducer] = useReducer(reducer, initialState);
  return <Provider value={{ state, categoryReducer }}>{children}</Provider>;
};

export { Categories, CategoriesProvider };

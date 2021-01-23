import React, { useContext, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Categories } from '../contexts/CategoriesProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import Dropzones from './Dropzones';
import CategoryGroup from './CategoryGroup';
import FavoritesGroup from './FavoritesGroup';

const Lists = () => {
  const categoriesState = useContext(Categories);
  const categories = categoriesState.state;
  const settingsState = useContext(Settings);
  const settings = settingsState.state || {};

  return (
    <>
      {categories && categories.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <Dropzones />
          {settings.favesGroup && <FavoritesGroup />}
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <CategoryGroup
                key={category.id}
                id={category.id}
                index={index}
                name={category.name}
              />
            ))}
        </DndProvider>
      ) : (
        <p>No Data.</p>
      )}
    </>
  );
};

export default Lists;

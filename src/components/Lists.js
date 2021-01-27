import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Categories } from '../contexts/CategoriesProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import Dropzones from './Dropzones';
import Category from './Category';

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
          {settings.favesGroup && (
            <Category group="favorites" name="Favorites" />
          )}
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <Category
                draggable={true}
                group={category.id}
                key={category.id}
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

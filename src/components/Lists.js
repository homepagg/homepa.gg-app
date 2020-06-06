import React, { useContext } from 'react';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import CategoryGroup from './CategoryGroup.js';

const Lists = () => {
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state.bookmarks || [];
  const categoriesState = useContext(Categories);
  const categories = categoriesState.state.categories || [];

  return (
    <section>
      {categories.length > 0 &&
        bookmarks.length > 0 &&
        categories.map((category) => {
          const categoryBookmarks = bookmarks
            .filter((bookmark) => bookmark.category === category.id)
            .sort((a, b) => a.name.localeCompare(b.name));

          return (
            categoryBookmarks.length > 0 && (
              <CategoryGroup
                key={category.id}
                name={category.name}
                bookmarks={categoryBookmarks}
              />
            )
          );
        })}
    </section>
  );
};

export default Lists;

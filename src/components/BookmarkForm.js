import React, { useContext, useRef, useState } from 'react';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';

const BookmarkForm = () => {
  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;

  const categoriesState = useContext(Categories);
  const categories = categoriesState.state.categories || [];
  const { categoryReducer } = categoriesState;

  const form = useRef();
  const categorySelect = useRef();
  const [addCategory, setAddCategory] = useState(false);

  const resetForm = () => {
    setAddCategory(false);
    categorySelect.current.required = addCategory;
    categorySelect.current.disabled = !addCategory;
    form.current.reset();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    if (addCategory) {
      categoryReducer({
        type: 'add',
        name: form.get('new-category'),
      });
    }

    const category = addCategory
      ? categories[categories.length - 1].id
      : parseInt(form.get('category'), 10);

    bookmarksReducer({
      type: 'add',
      name: form.get('name'),
      link: form.get('link'),
      category: category,
    });

    resetForm();
  };

  const toggleAddCategory = (event) => {
    event.preventDefault();
    setAddCategory(!addCategory);
    categorySelect.current.required = addCategory;
    categorySelect.current.disabled = !addCategory;
  };

  return (
    <form onReset={resetForm} onSubmit={handleSubmit} ref={form}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" required type="text" />
      <label htmlFor="link">URL</label>
      <input id="link" name="link" required type="url" />
      <label htmlFor="category">Category</label>
      <fieldset>
        <select id="category" name="category" ref={categorySelect} required>
          <option value=""></option>
          {categories.length > 0
            ? categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })
            : null}
        </select>
        or
        <button onClick={toggleAddCategory}>
          <span>Category</span>
        </button>
      </fieldset>
      {addCategory ? (
        <fieldset>
          <label htmlFor="new-category">Name your new category</label>
          <input id="new-category" name="new-category" required type="text" />
          <button onClick={toggleAddCategory} title="Delete">
            &times;
          </button>
        </fieldset>
      ) : null}
      <label htmlFor="favorite">Favorite</label>
      <label htmlFor="favorite">
        <input id="favorite" name="favorite" type="checkbox" />
        <em>Include this bookmark in your favorites section</em>
      </label>
      <div>
        <button type="submit">
          <span>Add</span>
        </button>
        <button type="reset">
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
};

export default BookmarkForm;

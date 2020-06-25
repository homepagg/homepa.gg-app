import React, { useContext, useEffect, useRef, useState } from 'react';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';

const BookmarkForm = ({ bookmarkId, formCallback }) => {
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state.bookmarks || [];
  const { bookmarksReducer } = bookmarksState;

  const categoriesState = useContext(Categories);
  const categories = categoriesState.state.categories || [];
  const { categoryReducer } = categoriesState;

  const form = useRef();
  const categorySelect = useRef();
  const [addCategory, setAddCategory] = useState(false);
  const [bookmark, setBookmark] = useState(null);

  const resetForm = () => {
    setAddCategory(false);
    categorySelect.current.disabled = !addCategory;
    form.current.reset();

    if (formCallback) formCallback();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    if (addCategory) {
      categoryReducer({
        type: 'ADD',
        name: form.get('new-category'),
      });
    }

    debugger;

    const category = addCategory
      ? categories[categories.length - 1].id
      : !form.get('category')
      ? '0'
      : parseInt(form.get('category'), 10);

    bookmark
      ? bookmarksReducer({
          type: 'EDIT',
          id: bookmarkId,
          name: form.get('name'),
          link: form.get('link'),
          category: category,
          favorite: form.get('favorite') === 'on',
        })
      : bookmarksReducer({
          type: 'ADD',
          name: form.get('name'),
          link: form.get('link'),
          category: category,
          favorite: form.get('favorite') === 'on',
        });

    resetForm();
  };

  const toggleAddCategory = (event) => {
    event.preventDefault();
    setAddCategory(!addCategory);
    categorySelect.current.disabled = !addCategory;
  };

  useEffect(() => {
    if (bookmarkId)
      setBookmark(
        bookmarks[bookmarks.map((node) => node.id).indexOf(bookmarkId)]
      );
  }, [bookmarkId, bookmarks]);

  return (
    <>
      <h1>{bookmark ? `Edit ${bookmark.name}` : 'Add a new bookmark'}</h1>
      <form onReset={resetForm} onSubmit={handleSubmit} ref={form}>
        <label htmlFor="name">Name</label>
        <input
          defaultValue={bookmark?.name}
          id="name"
          name="name"
          required
          type="text"
        />
        <label htmlFor="link">URL</label>
        <input
          defaultValue={bookmark?.link}
          id="link"
          name="link"
          required
          type="url"
        />
        <label htmlFor="category">Category</label>
        <fieldset>
          <select
            defaultValue={bookmark?.category || ''}
            id="category"
            key={`category-select-${bookmark?.category || 0}`}
            name="category"
            ref={categorySelect}>
            <option value=""></option>
            {categories.length > 0
              ? categories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => {
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
          <input
            defaultChecked={bookmark?.favorite}
            id="favorite"
            name="favorite"
            type="checkbox"
          />
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
    </>
  );
};

export default BookmarkForm;

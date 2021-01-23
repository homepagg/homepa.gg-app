import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import Vibrant from 'node-vibrant';
import ReactModal from 'react-modal';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import ColorPicker from './ColorPicker';
import styles from './BookmarkForm.module.css';
import { ReactComponent as CancelSvg } from '../images/icons/cancel.svg';

const BookmarkForm = ({ bookmarkId, closeModal, showModal }) => {
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state.bookmarks || [];
  const { bookmarksReducer } = bookmarksState;

  const categoriesState = useContext(Categories);
  const categories = categoriesState.state.categories || [];
  const { categoriesReducer } = categoriesState;

  const form = useRef();
  const linkInput = useRef();

  const [addCategory, setAddCategory] = useState(false);
  const [bookmark, setBookmark] = useState(null);
  const [color, setColor] = useState('');

  const getPalette = async () => {
    if (!linkInput.current.checkValidity()) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = `https://cors-anywhere.herokuapp.com/http://www.google.com/s2/favicons?domain=${linkInput.current.value}`;

    const palette = await Vibrant.from(image).getPalette();
    setColor(
      palette.Vibrant?.getHex() ||
        palette.Muted?.getHex() ||
        palette[
          Object.keys(palette)[
            Object.values(palette).indexOf(
              Object.values(palette).find((e) => e !== null)
            )
          ]
        ] ||
        '#888'
    );
  };

  const resetForm = () => {
    setAddCategory(false);
    form.current.reset();
    closeModal();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    if (addCategory) {
      categoriesReducer({
        type: 'ADD',
        name: form.get('new-category'),
      });
    }

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
          color: color,
          favorite: form.get('favorite') === 'on',
        })
      : bookmarksReducer({
          type: 'ADD',
          name: form.get('name'),
          link: form.get('link'),
          category: category,
          color: color,
          favorite: form.get('favorite') === 'on',
        });

    resetForm();
  };

  const toggleAddCategory = (event) => {
    event.preventDefault();
    setAddCategory(!addCategory);
  };

  useEffect(() => {
    if (bookmarkId)
      setBookmark(
        bookmarks[bookmarks.map((node) => node.id).indexOf(bookmarkId)]
      );
  }, [bookmarkId, bookmarks]);

  return (
    <ReactModal
      className={styles.modal}
      isOpen={showModal}
      overlayClassName={styles.overlay}>
      <h1 className={styles.title}>
        {bookmark ? `Edit ${bookmark.name}` : 'Add a new bookmark'}
      </h1>
      <button
        className={styles.close}
        onClick={closeModal}
        title="Close Settings">
        <CancelSvg />
      </button>
      <form
        className={styles.form}
        onReset={resetForm}
        onSubmit={handleSubmit}
        ref={form}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          className={styles.input}
          defaultValue={bookmark?.name}
          id="name"
          name="name"
          required
          type="text"
        />
        <label className={styles.label} htmlFor="link">
          URL
        </label>
        <input
          className={styles.input}
          defaultValue={bookmark?.link}
          id="link"
          name="link"
          onBlur={getPalette}
          required
          ref={linkInput}
          type="url"
        />
        <label className={styles.label}>Color</label>
        <ColorPicker
          classes={styles.input}
          color={color}
          onChange={({ hex }) => setColor(hex)}
        />
        <label className={styles.label} htmlFor="category">
          Category
        </label>
        {addCategory ? (
          <fieldset className={cx(styles.input, styles.newCategory)}>
            <label htmlFor="new-category">Name your new category</label>
            <input id="new-category" name="new-category" required type="text" />
            <button onClick={toggleAddCategory} title="Delete">
              <CancelSvg />
            </button>
          </fieldset>
        ) : (
          <fieldset className={cx(styles.input, styles.chooseCategory)}>
            <select
              defaultValue={bookmark?.category || ''}
              id="category"
              key={`category-select-${bookmark?.category || 0}`}
              name="category">
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
        )}
        <label className={styles.label} htmlFor="favorite">
          Favorite
        </label>
        <label className={styles.input} htmlFor="favorite">
          <input
            defaultChecked={bookmark?.favorite}
            id="favorite"
            name="favorite"
            type="checkbox"
          />
          <em>Include this bookmark in your favorites section</em>
        </label>
        <div className={styles.controls}>
          <button className={cx(styles.control, styles.submit)} type="submit">
            <span>{bookmark ? 'Save' : 'Add'}</span>
          </button>
          <button className={cx(styles.control, styles.reset)} type="reset">
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default BookmarkForm;

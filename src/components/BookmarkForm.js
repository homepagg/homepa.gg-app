import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Vibrant from 'node-vibrant';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import Modal from './Modal';
import ColorPicker from './ColorPicker';
import { ReactComponent as CancelSvg } from '../images/icons/cancel.svg';

const Controls = styled.div`
  display: grid;
  grid-column: 1 / 3;
  grid-column-gap: 12px;
  grid-template-columns: 1fr 1fr;
`;

const Control = styled.button`
  font-weight: 700;
  padding: 12px 24px;
  text-transform: uppercase;
`;

const Form = styled.form`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: max-content 1fr;
`;

const Input = styled.input`
  grid-column: 2;
`;

const Fieldset = styled(Input).attrs({
  as: 'fieldset',
})`
  align-items: center;
  display: flex;

  button {
    margin-left: 1ch;
  }

  select {
    flex: 1;
    margin-right: 1ch;
  }
`;

const Label = styled.label`
  font-weight: 600;
  grid-column: 1;
  padding: 6px 0;
`;

const Picker = styled(ColorPicker)`
  grid-column: 2;
`;

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
    <Modal
      closeModal={closeModal}
      isOpen={showModal}
      title={bookmark ? `Edit ${bookmark.name}` : 'Add a new bookmark'}>
      <Form onReset={resetForm} onSubmit={handleSubmit} ref={form}>
        <Label htmlFor="name">Name</Label>
        <Input
          defaultValue={bookmark?.name}
          id="name"
          name="name"
          required
          type="text"
        />
        <Label htmlFor="link">URL</Label>
        <Input
          defaultValue={bookmark?.link}
          id="link"
          name="link"
          onBlur={getPalette}
          required
          ref={linkInput}
          type="url"
        />
        <Label>Color</Label>
        <Picker color={color} onChange={({ hex }) => setColor(hex)} />
        <Label htmlFor="category">Category</Label>
        {addCategory ? (
          <Fieldset>
            <label htmlFor="new-category">Name your new category</label>
            <input id="new-category" name="new-category" required type="text" />
            <button onClick={toggleAddCategory} title="Delete">
              <CancelSvg />
            </button>
          </Fieldset>
        ) : (
          <Fieldset>
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
          </Fieldset>
        )}
        <Label htmlFor="favorite">Favorite</Label>
        <Input as="label" htmlFor="favorite">
          <input
            defaultChecked={bookmark?.favorite}
            id="favorite"
            name="favorite"
            type="checkbox"
          />
          <em>Include this bookmark in your favorites section</em>
        </Input>
        <Controls>
          <Control type="submit">
            <span>{bookmark ? 'Save' : 'Add'}</span>
          </Control>
          <Control type="reset">
            <span>Cancel</span>
          </Control>
        </Controls>
      </Form>
    </Modal>
  );
};

export default BookmarkForm;

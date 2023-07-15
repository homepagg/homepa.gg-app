import React, { useContext, useEffect, useRef, useState } from 'react';
// import Vibrant from 'node-vibrant';

import { BookmarksContext } from '../../contexts/BookmarksProvider';
import { Categories } from '../../contexts/CategoriesProvider';
import Modal from '../Modal/Modal';
import ColorPicker from '../ColorPicker/ColorPicker';
import { ReactComponent as CancelSvg } from '../../images/icons/cancel.svg';

import styles from './BookmarkForm.module.css';

const BookmarkForm = ({ bookmarkId, closeModal, showModal }) => {
    const bookmarksState = useContext(BookmarksContext);
    const bookmarks = bookmarksState.state;
    const { bookmarksDispatcher } = bookmarksState;

    const categoriesState = useContext(Categories);
    const categories = categoriesState.state;
    const { categoriesDispatcher } = categoriesState;

    const favicon = useRef();
    const form = useRef();
    const linkInput = useRef();

    const [addCategory, setAddCategory] = useState(false);
    const [bookmark, setBookmark] = useState(null);
    const [url, setUrl] = useState('');
    const [color, setColor] = useState('');

    const getPalette = async () => {
        if (!linkInput.current.checkValidity()) return;

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = `https://api.allorigins.win/raw?url=http://www.google.com/s2/favicons?domain=${linkInput.current.value}`;

        // const palette = await Vibrant.from(image).getPalette();

        // setColor(
        //   palette.Vibrant?.getHex() ||
        //     palette.Muted?.getHex() ||
        //     palette[
        //       Object.keys(palette)[
        //         Object.values(palette).indexOf(
        //           Object.values(palette).find((e) => e !== null)
        //         )
        //       ]
        //     ] ||
        //     '#888'
        // );
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
            categoriesDispatcher({
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
            ? bookmarksDispatcher({
                  type: 'EDIT',
                  id: bookmarkId,
                  name: form.get('name'),
                  link: form.get('link'),
                  category: category,
                  color: color,
                  favorite: form.get('favorite') === 'on',
              })
            : bookmarksDispatcher({
                  type: 'ADD',
                  name: form.get('name'),
                  link: form.get('link'),
                  category: category,
                  color: color,
                  favorite: form.get('favorite') === 'on',
              });

        bookmarksDispatcher({ type: 'UPDATE_REMOTE' });
        resetForm();
    };

    const toggleAddCategory = (event) => {
        event.preventDefault();
        setAddCategory(!addCategory);
    };

    useEffect(() => {
        if (!bookmarkId) return;
        const data =
            bookmarks[bookmarks.map((node) => node.id).indexOf(bookmarkId)];
        setBookmark(data);
        setColor(data.color);
        setUrl(data.link);
    }, [bookmarkId, bookmarks]);

    return (
        <Modal
            closeModal={closeModal}
            isOpen={showModal}
            title={bookmark ? `Edit ${bookmark.name}` : 'Add a new bookmark'}
        >
            <form
                className={styles.form}
                onReset={resetForm}
                onSubmit={handleSubmit}
                ref={form}
            >
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
                <div className={styles.url}>
                    <img
                        alt=""
                        ref={favicon}
                        src={`http://www.google.com/s2/favicons?domain=${
                            url ? url : 'undefined'
                        }`}
                    />
                    <input
                        defaultValue={bookmark?.link}
                        id="link"
                        name="link"
                        onBlur={getPalette}
                        onChange={(event) => setUrl(event.target.value)}
                        required
                        ref={linkInput}
                        type="url"
                    />
                </div>
                {/*eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={styles.label}>Color</label>
                <div className={styles.picker}>
                    <ColorPicker
                        color={color}
                        onChange={({ hex }) => setColor(hex)}
                    />
                </div>
                <label className={styles.label} htmlFor="category">
                    Category
                </label>
                {addCategory ? (
                    <fieldset className={styles.fields}>
                        <label htmlFor="new-category">
                            Name your new category
                        </label>
                        <input
                            id="new-category"
                            name="new-category"
                            required
                            type="text"
                        />
                        <button onClick={toggleAddCategory} title="Delete">
                            <CancelSvg />
                        </button>
                    </fieldset>
                ) : (
                    <fieldset className={styles.fields}>
                        <select
                            defaultValue={bookmark?.category || ''}
                            id="category"
                            key={`category-select-${bookmark?.category || 0}`}
                            name="category"
                        >
                            <option value=""></option>
                            {categories.length > 0 ? (
                                categories
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    )
                                    .map((category) => {
                                        return (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        );
                                    })
                            ) : (
                                <></>
                            )}
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
                <label className={styles.input}>
                    <input
                        defaultChecked={bookmark?.favorite}
                        id="favorite"
                        name="favorite"
                        type="checkbox"
                    />
                    <em>Include this bookmark in your favorites section</em>
                </label>
                <div className={styles.controls}>
                    <button className={styles.control} type="submit">
                        <span>{bookmark ? 'Save' : 'Add'}</span>
                    </button>
                    <button className={styles.control} type="reset">
                        <span>Cancel</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BookmarkForm;

import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import ReactModal from 'react-modal';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import CategoryGroup from './CategoryGroup.js';
import BookmarkForm from '../components/BookmarkForm.js';
import { Settings } from '../contexts/SettingsProvider.js';
import { ReactComponent as CancelSvg } from '../images/icons/cancel.svg';
import { ReactComponent as PencilSvg } from '../images/icons/pencil.svg';
import { ReactComponent as PlusSvg } from '../images/icons/plus.svg';
import styles from './Lists.module.css';

const Lists = () => {
  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const bookmarks = bookmarksState.state.bookmarks || [];

  const categoriesState = useContext(Categories);
  const { categoryReducer } = categoriesState;
  const categories = categoriesState.state.categories || [];

  const settingsState = useContext(Settings);
  const settings = settingsState.state || {};

  const [isDragging, setIsDragging] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null);
  const [overDelete, setOverDelete] = useState(false);
  const [editModalId, setEditModalId] = useState(null);
  const [overEdit, setOverEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortedCategories, setSortedCategories] = useState(
    categories.sort((a, b) => (a.order > b.order ? 1 : -1)) || []
  );

  const hasData = categories.length > 0 && bookmarks.length > 0;

  const closeModal = () => {
    setShowModal(false);
    setEditModalId(null);
    resetDrag();
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    resetDrag();
    bookmarksReducer({ type: 'REMOVE', id: id });
  };

  const handleEdit = (event, id) => {
    event.preventDefault();
    setEditModalId(id);
    setShowModal(true);
    resetDrag();
  };

  const resetDrag = () => {
    setDraggingNode(null);
    setIsDragging(false);
    setOverDelete(false);
    setOverEdit(false);
  };

  const favoriteBookmarks = () => {
    return bookmarks
      .filter((bookmark) => bookmark.favorite)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const updateCategoryOrder = () => {
    const newOrder = {
      categories: sortedCategories.map((category, i) => {
        category.order = i + 1;
        return {
          id: category.id,
          name: category.name,
          order: category.order,
        };
      }),
    };

    setIsSorting(false);
    categoryReducer({ type: 'UPDATE', categories: newOrder });
  };

  useEffect(() => {
    const dragstart = (event) => {
      if (
        event.target.nodeType === 1 &&
        !!event.target.closest('[data-bookmark]')
      )
        setIsDragging(true);
    };

    const dragend = () => setIsDragging(false);

    document.addEventListener('dragstart', dragstart);
    document.addEventListener('dragend', dragend);

    return () => {
      document.removeEventListener('dragstart', dragstart);
      document.removeEventListener('dragend', dragend);
    };
  }, []);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <PlusSvg />
        Add Bookmark
      </button>

      {hasData ? (
        <>
          {isDragging && (
            <ul className={styles.dropzones}>
              <li
                className={cx(styles.dropzone, { [styles.over]: overDelete })}
                onDragEnter={() => setOverDelete(true)}
                onDragLeave={() => setOverDelete(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDelete(event, draggingNode)}>
                <span className={styles.label}>
                  <CancelSvg />
                  Delete
                </span>
              </li>
              <li
                className={cx(styles.dropzone, { [styles.over]: overEdit })}
                onDragEnter={() => setOverEdit(true)}
                onDragLeave={() => setOverEdit(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleEdit(event, draggingNode)}>
                <span className={styles.label}>
                  <PencilSvg />
                  Edit
                </span>
              </li>
            </ul>
          )}

          {settings.favesGroup && favoriteBookmarks().length > 0 && (
            <CategoryGroup
              name="Favorites"
              bookmarks={favoriteBookmarks()}
              setDraggingNode={setDraggingNode}
            />
          )}

          <ReactSortable
            handle="[data-sortable-handle]"
            list={sortedCategories}
            onStart={() => setIsSorting(true)}
            onEnd={updateCategoryOrder}
            setList={(list) => setSortedCategories(list)}>
            {sortedCategories.map((category) => {
              let categoryBookmarks = bookmarks
                .filter((bookmark) => bookmark.category === category.id)
                .sort((a, b) => a.name.localeCompare(b.name));

              if (settings.favesHide)
                categoryBookmarks = categoryBookmarks.filter(
                  (bookmark) => bookmark.favorite === false
                );

              return (
                categoryBookmarks.length > 0 && (
                  <CategoryGroup
                    key={category.id}
                    name={category.name}
                    bookmarks={categoryBookmarks}
                    setDraggingNode={setDraggingNode}
                    sortable={true}
                    sorting={isSorting}
                  />
                )
              );
            })}
          </ReactSortable>
        </>
      ) : (
        <p>No Data.</p>
      )}

      <ReactModal isOpen={showModal} onRequestClose={closeModal}>
        <BookmarkForm bookmarkId={editModalId} formCallback={closeModal} />
      </ReactModal>
    </>
  );
};

export default Lists;

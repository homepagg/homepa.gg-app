import React, { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Categories } from '../contexts/CategoriesProvider.js';
import CategoryGroup from './CategoryGroup.js';
import BookmarkForm from '../components/BookmarkForm.js';

const Lists = () => {
  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const bookmarks = bookmarksState.state.bookmarks || [];

  const categoriesState = useContext(Categories);
  const categories = categoriesState.state.categories || [];

  const [isDragging, setIsDragging] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null);
  const [overDelete, setOverDelete] = useState(false);
  const [overEdit, setOverEdit] = useState(false);
  const [editModalId, setEditModalId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const dragstart = () => setIsDragging(true);
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
      <button onClick={() => setShowModal(true)}>+ Add Bookmark</button>
      {isDragging && (
        <ul
          style={{
            display: 'grid',
            gridGap: '5px',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '80px 80px',
            listStyle: 'none',
          }}>
          <li
            onDragEnter={() => setOverDelete(true)}
            onDragLeave={() => setOverDelete(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDelete(event, draggingNode)}
            style={{
              alignItems: 'center',
              backgroundColor: overDelete ? 'lightskyblue' : '#eee',
              display: 'flex',
              justifyContent: 'center',
            }}>
            Delete
          </li>
          <li
            onDragEnter={() => setOverEdit(true)}
            onDragLeave={() => setOverEdit(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleEdit(event, draggingNode)}
            style={{
              alignItems: 'center',
              backgroundColor: overEdit ? 'lightskyblue' : '#eee',
              display: 'flex',
              justifyContent: 'center',
            }}>
            Edit
          </li>
        </ul>
      )}
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
                setDraggingNode={setDraggingNode}
              />
            )
          );
        })}

      <ReactModal isOpen={showModal} onRequestClose={closeModal}>
        <BookmarkForm bookmarkId={editModalId} formCallback={closeModal} />
      </ReactModal>
    </>
  );
};

export default Lists;

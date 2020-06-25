import React from 'react';

const CategoryGroup = ({ name, bookmarks, setDraggingNode }) => {
  const openAll = () =>
    bookmarks.forEach((bookmark) => window.open(bookmark.link));

  return (
    <section>
      <h2>
        {name} <button onClick={openAll}>Open All</button>
      </h2>
      <ul>
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            onDragStart={() => setDraggingNode(bookmark.id)}
            onDragEnd={() => setDraggingNode(null)}>
            <a href={bookmark.link} title={bookmark.name}>
              <img
                alt=""
                src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
              />
              {bookmark.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategoryGroup;

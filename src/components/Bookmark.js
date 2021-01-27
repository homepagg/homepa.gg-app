import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useDrag } from 'react-dnd';
import Color from 'color';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Session } from '../contexts/SessionProvider.js';
import BookmarkForm from './BookmarkForm.js';

const Container = styled.li`
  display: block;
  list-style: none;
  user-select: none;
`;

const Icon = styled.span`
  display: flex;
  filter: drop-shadow(1px 0 0 hsla(var(--accent-color), 0.72))
    drop-shadow(-1px 0 0 hsla(var(--accent-color), 0.72))
    drop-shadow(0 1px 0 hsla(var(--accent-color), 0.72))
    drop-shadow(0 -1px 0 hsla(var(--accent-color), 0.72));
  flex-shrink: 0;
  height: calc(100% - 12px);
  margin-right: 9px;
  width: auto;
`;

const Img = styled.img`
  border-radius: 24%;
  height: 16px;
  width: 16px;
`;

const Link = styled.a`
  align-items: center;
  background-color: hsla(var(--accent-color), 0.24);
  border-radius: 0.36em;
  color: inherit;
  display: flex;
  line-height: 1.2;
  padding: 0.62em;
  text-decoration: none;

  &:hover {
    background-color: hsla(var(--accent-color), 0.64);
  }
`;

const Text = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Bookmark = ({ bookmark }) => {
  const sessionState = useContext(Session);
  const session = sessionState.state;
  const bookmarksState = useContext(Bookmarks);
  const { bookmarksReducer } = bookmarksState;
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [accentColor, setAccentColor] = useState('');
  const container = useRef();

  const [, containerRef] = useDrag({
    item: { bookmark, type: 'bookmark' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult?.type === 'edit') setAddingBookmark(true);
      if (item && dropResult?.type === 'delete')
        bookmarksReducer({ type: 'EDIT', id: bookmark.id });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  containerRef(container);

  useEffect(() => {
    if (!container.current) return;

    let color;

    switch (session.theme) {
      case 'light':
        color = Color(bookmark.color).lightness(84);
        break;
      case 'dark':
        color = Color(bookmark.color).lightness(24);
        break;
      default:
        color = Color(bookmark.color);
    }

    const hsl = color.hsl().object();

    setAccentColor(
      `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
    );
  }, [bookmark.color, container, session.theme]);

  return (
    <>
      <Container
        draggable="true"
        ref={container}
        style={{ '--accent-color': `${accentColor}` }}>
        <Link
          href={bookmark.link}
          rel="nofollow noopener"
          title={bookmark.name}>
          <Icon>
            <Img
              alt=""
              src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
            />
          </Icon>
          <Text>{bookmark.name}</Text>
        </Link>
      </Container>
      <BookmarkForm
        bookmarkId={bookmark.id}
        closeModal={() => setAddingBookmark(false)}
        showModal={addingBookmark}
      />
    </>
  );
};

export default Bookmark;

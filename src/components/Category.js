import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Bookmarks } from '../contexts/BookmarksProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import MoveHandle from './MoveHandle.js';
import Bookmark from './Bookmark';
import { ReactComponent as ArrowSvg } from '../images/icons/arrow.svg';

const Container = styled.section`
  padding: 24px 36px;
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  position: relative;

  &::after,
  &::before {
    content: '';
    display: block;
    flex: 1;
    opacity: 0.12;
  }

  &::after {
    margin-left: 1em;
  }

  &::before {
    margin-right: 1em;
  }
`;

const List = styled.ul`
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  justify-self: stretch;
  list-style: none;
  margin-top: 24px;
`;

const OpenAll = styled.button`
  flex: 0 0 auto;
  font-style: italic;
  font-weight: 700;
  opacity: 0.5;
  text-transform: uppercase;

  svg {
    margin-left: 0.5ch;
    opacity: 0.24;
    transform: translateY(0.1em);
  }

  &:hover {
    opacity: 1;
  }
`;

const Title = styled.h2`
  flex: 0 0 auto;
  font-weight: 500;
  margin-right: 1em;
`;

const Category = ({ draggable, group, index, name }) => {
  const container = useRef(null);
  const bookmarksState = useContext(Bookmarks);
  const bookmarks = bookmarksState.state;
  const settingsState = useContext(Settings);
  const settings = settingsState.state;
  const [categoryBookmarks, setCategoryBookmarks] = useState([]);

  useEffect(() => {
    if (bookmarks.length === 0 && settings.length === 0) return;

    let filtered;

    if (group === 'favorites') {
      filtered = bookmarks.filter((bookmark) => bookmark.favorite);
    } else {
      filtered = bookmarks.filter((bookmark) => bookmark.category === group);
    }

    if (settings.favesHide)
      filtered = filtered.filter((bookmark) => bookmark.favorite === false);

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setCategoryBookmarks(filtered);
  }, [group, bookmarks, settings]);

  const openAll = () =>
    bookmarks.forEach((bookmark) => window.open(bookmark.link));

  return (
    <Container ref={container}>
      <Header>
        <Title>{name}</Title>
        <OpenAll onClick={openAll}>
          Open All
          <ArrowSvg />
        </OpenAll>
        {draggable && <MoveHandle container={container} index={index} />}
      </Header>
      <List>
        {categoryBookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </List>
    </Container>
  );
};

export default Category;

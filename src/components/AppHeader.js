import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Session } from '../contexts/SessionProvider.js';
import AppSettings from './AppSettings';
import BookmarkForm from './BookmarkForm.js';
import { ReactComponent as LogoSvg } from '../images/letter-logo.svg';
import { ReactComponent as PlusSvg } from '../images/icons/plus.svg';
import { ReactComponent as SettingsSvg } from '../images/icons/settings.svg';

const Button = styled.button`
  flex: 0 0 auto;
  font-size: 18px;
  padding: 0;
  position: relative;
  width: 100%;

  &::after {
    border-radius: 0;
    opacity: 0;
  }

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
    width: 100%;
  }

  svg {
    left: 50%;
    opacity: 0.5;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 48px;
  z-index: 1;

  &::after {
    content: '';
    height: 100%;
    left: 0;
    opacity: 0.06;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }

  &::before {
    border-right: 1px solid hsl(var(--color-primary));
    content: '';
    height: 100%;
    opacity: 0.06;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: -1;
  }
`;

const Logo = styled(LogoSvg)`
  display: block;
  fill: hsl(var(--color-secondary));
  height: 100%;
  left: 0;
  padding: 12px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const Settings = styled(Button)`
  margin-top: auto;
`;

const Title = styled.h1`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-size: 1em;
  font-weight: 300;
  justify-content: center;
  position: relative;
  text-transform: none;
  width: 100%;
  z-index: 0;

  &::after {
    background-color: hsl(var(--color-primary));
    content: '';
    display: block;
    opacity: 0.72;
    padding-bottom: 100%;
    width: 100%;
  }
`;

const Tooltip = styled.span`
  background-color: hsl(var(--color-primary));
  border-radius: 6px;
  color: hsl(var(--color-secondary));
  font-size: 1.4rem;
  font-weight: 500;
  left: calc(100% + 6px);
  opacity: 0;
  padding: 3px 6px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  z-index: 0;

  &::after {
    border-color: transparent hsl(var(--color-primary)) transparent transparent;
    border-style: solid;
    border-width: 4px 6px;
    content: '';
    height: 0;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translate(-99%, -50%);
    width: 0;
    z-index: -1;
  }

  :hover > .& {
    opacity: 1;
  }
`;

const AppHeader = () => {
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [managingSettings, setManagingSettings] = useState(false);

  const sessionState = useContext(Session);
  const activeSession = sessionState.state.loggedIn || false;

  return (
    <Header>
      <Title>
        <Logo />
        <Tooltip>Baile</Tooltip>
      </Title>
      {activeSession && (
        <>
          <Button onClick={() => setAddingBookmark(true)}>
            <PlusSvg />
            <Tooltip>Add Bookmark</Tooltip>
          </Button>
          <BookmarkForm
            closeModal={() => setAddingBookmark(false)}
            showModal={addingBookmark}
          />
          <Settings onClick={() => setManagingSettings(!managingSettings)}>
            <SettingsSvg />
            <Tooltip>Settings</Tooltip>
          </Settings>
          <AppSettings
            closeModal={() => setManagingSettings(false)}
            showModal={managingSettings}
          />
        </>
      )}
    </Header>
  );
};

export default AppHeader;

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Session } from '../contexts/SessionProvider.js';
import { Settings } from '../contexts/SettingsProvider.js';
import Modal from './Modal';
import { ReactComponent as LogoutSvg } from '../images/icons/logout.svg';

const Checkbox = styled.input`
  &[type='checkbox'] {
    left: 1.2em;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    z-index: 2;
  }
`;

const Fieldset = styled.fieldset`
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
`;

const Field = styled.label`
  align-items: center;
  background-color: hsla(var(--color-primary), 0.06);
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px;
  position: relative;
  z-index: 0;

  &:hover {
    background-color: hsla(var(--color-primary), 0.12);
  }
`;

const Favorite = styled(Field)`
  grid-column: span 2;
  padding-left: 2.4em;
  padding-right: 2.4em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Radio = styled.input`
  &[type='radio'] {
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: calc(100%);
    z-index: 2;
  }
`;

const Logout = styled(Link)`
  margin-top: auto;
`;

const Theme = styled(Field)`
  &::after {
    background-color: hsla(var(--color-primary), 0.06);
    border-radius: 0 0 0.8em 0.8em;
    content: '';
    height: 0.8em;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    top: 100%;
    width: 1.6em;
    z-index: 1;
  }

  &:hover::after {
    background-color: hsla(var(--color-primary), 0.12);
  }
`;

const Title = styled.h3`
  grid-column: 1 / -1;
`;

const themeOptions = [
  { name: 'Solar', type: 'solar' },
  { name: 'Light', type: 'light' },
  { name: 'Dark', type: 'dark' },
  { name: 'System', type: 'default' },
];

const AppSettings = ({ closeModal, showModal }) => {
  const sessionState = useContext(Session);
  const activeSession = sessionState.state.loggedIn || false;

  const settingsState = useContext(Settings);
  const { settingsReducer } = settingsState;
  const settings = settingsState.state || {};

  const [updated, setUpdated] = useState(false);
  const [theme, setTheme] = useState('default');
  const [favesGroup, setFavesGroup] = useState(true);
  const [favesHide, setFavesHide] = useState(false);

  const updateTheme = (value) => {
    setTheme(value);
    settingsReducer({ type: 'SET_THEME', value: value });
  };

  const updateFavsGroup = (value) => {
    setFavesGroup(value);
    settingsReducer({ type: 'SET_FAVORITES_GROUP', value: value });
  };

  const updateFavesHide = (value) => {
    setFavesHide(value);
    settingsReducer({ type: 'SET_SHOW_FAVORITES', value: value });
  };

  useEffect(() => {
    if (updated || Object.keys(settings).length === 0) return;
    setUpdated(true);
    setTheme(settings.theme);
    setFavesGroup(settings.favesGroup);
    setFavesHide(settings.favesHide);
  }, [settings, updated]);

  return activeSession ? (
    <Modal closeModal={closeModal} isOpen={showModal} title="Settings">
      <Form>
        <Fieldset>
          <Title>Theme</Title>
          {themeOptions.map((themeOption) => (
            <Theme key={themeOption.type}>
              <Radio
                checked={themeOption.type === theme}
                name="theme"
                onChange={() => updateTheme(themeOption.type)}
                type="radio"
                value={themeOption.type}
              />
              <span>{themeOption.name}</span>
            </Theme>
          ))}
        </Fieldset>
        <Fieldset>
          <Title>Favorites</Title>
          <Favorite>
            <Checkbox
              checked={favesGroup}
              onChange={(event) => updateFavsGroup(event.target.checked)}
              type="checkbox"
            />
            <span>Show Favorites group</span>
          </Favorite>
          <Favorite>
            <Checkbox
              checked={favesHide}
              onChange={(event) => updateFavesHide(event.target.checked)}
              type="checkbox"
            />
            <span>Hide favorites in categories</span>
          </Favorite>
        </Fieldset>
        <Logout to="/logout">
          <LogoutSvg />
          Logout
        </Logout>
      </Form>
    </Modal>
  ) : null;
};

export default AppSettings;

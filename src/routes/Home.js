import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Session } from '../contexts/SessionProvider.js';
import BookmarkForm from '../components/BookmarkForm.js';
import Lists from '../components/Lists';

const Home = () => {
  const sessionState = useContext(Session);
  const activeSession = sessionState.state.loggedIn || false;

  return localStorage.getItem('accessToken') === '' ? (
    <Link to="/auth">Login</Link>
  ) : !activeSession ? (
    <Redirect to="/update" />
  ) : (
    <>
      <BookmarkForm />
      <Lists />
    </>
  );
};

export default Home;

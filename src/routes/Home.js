import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import BookmarkForm from '../components/BookmarkForm.js';
import Lists from '../components/Lists';

const Home = () => {
  const checkContextToSeeIfUpdated = false;

  return localStorage.getItem('accessToken') === '' ? (
    <Link to="/auth">Login</Link>
  ) : checkContextToSeeIfUpdated ? (
    <Redirect to="/update" />
  ) : (
    <>
      <BookmarkForm />
      <Lists />
    </>
  );
};

export default Home;

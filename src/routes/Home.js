import React from 'react';
import { Link } from 'react-router-dom';
import BookmarkForm from '../components/BookmarkForm.js';
import Lists from '../components/Lists';

const Home = () => {
  return (
    <>
      <Link to="/auth">Login</Link>
      <BookmarkForm />
      <Lists />
    </>
  );
};

export default Home;

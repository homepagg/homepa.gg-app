import React from 'react';
import { Link } from 'react-router-dom';
import Lists from '../components/Lists';

const Home = () => {
  return !localStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken') === '' ? (
    <Link to="/auth">Login</Link>
  ) : (
    <Lists />
  );
};

export default Home;

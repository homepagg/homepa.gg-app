import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h2>Sorry, but your stuff is borked.</h2>
      <p>
        I&rsquo;m not sure what happened, maybe your Dropbox credentials are out
        of date?
      </p>
      <Link to="/logout">Reset my stuff</Link>
    </>
  );
};

export default Home;

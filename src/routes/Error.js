import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const [clean, setClean] = useState(false);

  const reset = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('bookmarksJson');
    localStorage.removeItem('bookmarksRevision');
    localStorage.removeItem('categoriesJson');
    localStorage.removeItem('categoriesRevision');
    setClean(true);
  };

  return clean ? (
    <Redirect to="/auth" />
  ) : (
    <>
      <h2>Sorry, but your stuff is borked.</h2>
      <p>
        I&rsquo;m not sure what happened, maybe your Dropbox credentials are out
        of date?
      </p>
      <button onClick={reset}>Reset my stuff</button>
    </>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  const [clean, setClean] = useState(false);

  useEffect(() => {
    if (clean) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('bookmarksJson');
    localStorage.removeItem('bookmarksRevision');
    localStorage.removeItem('categoriesJson');
    localStorage.removeItem('categoriesRevision');

    setClean(true);
  }, [clean]);

  return clean ? <Redirect to="/" /> : <h2>Logging out&hellip;</h2>;
};

export default Logout;

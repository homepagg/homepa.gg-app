import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Dropbox } from 'dropbox';

const Auth = () => {
  const [accessToken, setAccessToken] = useState('');
  const [hasToken, setHasToken] = useState(false);

  const getDropboxAuthCode = () => {
    const dbx = new Dropbox({ clientId: '5xp9p5yhgpd6oe9' });
    return dbx.getAuthenticationUrl(`${window.location}`);
  };

  useEffect(() => {
    const getToken = () => {
      const hashObj = {};

      window.location.hash
        .replace('#', '')
        .split('&')
        .forEach((item) => {
          hashObj[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
        });

      if (hashObj.access_token) {
        setAccessToken(hashObj.access_token);
      } else {
        window.open(getDropboxAuthCode(), '_self');
      }
    };

    if (localStorage.getItem('accessToken')) {
      setAccessToken(localStorage.getItem('accessToken'));
    } else {
      getToken();
    }
  }, []);

  useEffect(() => {
    if (!accessToken || accessToken === '' || accessToken === 'undefined')
      return;
    localStorage.setItem('accessToken', accessToken);
    setHasToken(true);
  }, [accessToken]);

  return hasToken ? <Redirect to="/" /> : <h2>Checking you out&hellip;</h2>;
};

export default Auth;

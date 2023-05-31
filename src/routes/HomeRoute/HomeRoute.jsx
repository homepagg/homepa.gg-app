import React from 'react';
import { Link } from 'react-router-dom';

import { useDropbox } from '../../contexts/DropboxProvider';

const HomeRoute = () => {
    const { dropbox } = useDropbox();

    return dropbox.auth_token === '' ? (
        <Link to="/auth">Login</Link>
    ) : (
        <Link to="/me">Login</Link>
    );
};

export default HomeRoute;

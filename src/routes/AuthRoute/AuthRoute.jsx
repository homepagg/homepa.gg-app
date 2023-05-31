import { useEffect } from 'react';
import { Dropbox } from 'dropbox';
import { Navigate } from 'react-router-dom';

import { useDropbox } from '../../contexts/DropboxProvider';

const AuthRoute = () => {
    const { dropbox, dropboxDispatcher } = useDropbox();

    useEffect(() => {
        if (window.location.hash !== '') {
            const items = window.location.hash
                .replace('#', '')
                .split('&')
                .reduce((obj, item) => {
                    obj[item.split('=')[0]] = item.split('=')[1];
                    return obj;
                }, {});
            dropboxDispatcher({
                fn: new Dropbox({ accessToken: items.access_token }),
                ...items,
            });
            return;
        }

        if (dropbox.access_token !== '') {
            return;
        }

        dropbox.fn.auth
            .getAuthenticationUrl(`${window.location}`)
            .then((url) => window.open(url, '_self'));
    }, [dropbox, dropboxDispatcher]);

    return dropbox.access_token ? (
        <Navigate to="/me" replace={true} />
    ) : (
        <h2>Checking you out&hellip;</h2>
    );
};

export default AuthRoute;

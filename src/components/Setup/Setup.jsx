import { useEffect } from 'react';
// import { Navigate } from 'react-router-dom';

import { useBookmarks } from '../../contexts/BookmarksProvider';
import { useCategories } from '../../contexts/CategoriesProvider';
import { useDropbox } from '../../contexts/DropboxProvider';
import { useSettings } from '../../contexts/SettingsProvider';

import styles from './Setup.module.scss';

const Setup = () => {
    const { dropbox } = useDropbox();
    const { bookmarksDispatcher } = useBookmarks();
    const { categoriesDispatcher } = useCategories();
    const { settingsDispatcher } = useSettings();

    useEffect(() => {
        const fetchData = async () => {
            const list = await dropbox.fn.filesListFolder({ path: '' });

            const files = list.result.entries.reduce(
                (fs, f) => ({
                    ...fs,
                    [f.name.replace('.json', '')]: {
                        rev: f.rev,
                        path: f.path_display,
                    },
                }),
                {}
            );

            const downloads = await Promise.allSettled(
                Object.values(files).map((f) =>
                    dropbox.fn.filesDownload({ path: f.path })
                )
            ).then((response) =>
                response.map((item) => ({
                    ...item.value.result,
                }))
            );

            const results = await Promise.allSettled(
                Object.values(downloads).map((d) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('loadend', () =>
                            resolve(JSON.parse(reader.result))
                        );
                        reader.readAsText(d.fileBlob);
                    });
                })
            ).then((response) =>
                response.map((item) => ({
                    ...item.value,
                }))
            );

            console.log({ results });

            bookmarksDispatcher(results[0]);
            categoriesDispatcher(results[1]);
            settingsDispatcher(results[2]);
        };

        console.log(
            bookmarksDispatcher,
            categoriesDispatcher,
            settingsDispatcher
        );

        dropbox.access_token &&
            bookmarksDispatcher !== undefined &&
            categoriesDispatcher !== undefined &&
            settingsDispatcher !== undefined &&
            fetchData();
    }, [
        dropbox,
        bookmarksDispatcher,
        categoriesDispatcher,
        settingsDispatcher,
    ]);

    return <></>;
};

export default Setup;

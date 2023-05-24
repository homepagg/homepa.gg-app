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
            const bookmarksVer = localStorage.getItem('hgg.bookmarks.version');
            const categoriesVer = localStorage.getItem(
                'hgg.categories.version'
            );
            const settingsVer = localStorage.getItem('hgg.settings.version');

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

            const { bookmarks, categories, settings } = files;

            if (
                bookmarksVer === bookmarks.rev &&
                categoriesVer === categories.rev &&
                settingsVer === settings.rev
            ) {
                console.log('same as previous');
                bookmarksDispatcher(
                    JSON.parse(localStorage.getItem('hgg.bookmarks.data'))
                );
                categoriesDispatcher(
                    JSON.parse(localStorage.getItem('hgg.categories.data'))
                );
                settingsDispatcher(
                    JSON.parse(localStorage.getItem('hgg.settings.data'))
                );
                return;
            }

            const downloads = await Promise.allSettled(
                Object.values(files).map((f) =>
                    dropbox.fn.filesDownload({ path: f.path })
                )
            ).then((response) => response.map((item) => item.value.result));

            const results = await Promise.allSettled(
                downloads.map((d) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('loadend', () =>
                            resolve(JSON.parse(reader.result))
                        );
                        reader.readAsText(d.fileBlob);
                    });
                })
            ).then((response) => response.map((item) => item.value));

            const [bookmarksData, categoriesData, settingsData] = results;

            // Bookmarks
            localStorage.setItem(
                'hgg.bookmarks.data',
                JSON.stringify(bookmarksData)
            );
            localStorage.setItem('hgg.bookmarks.version', bookmarks.rev);
            bookmarksDispatcher(bookmarksData);

            // Categories
            localStorage.setItem(
                'hgg.categories.data',
                JSON.stringify(categoriesData)
            );
            localStorage.setItem('hgg.categories.version', categories.rev);
            categoriesDispatcher(categoriesData);

            // Settings
            localStorage.setItem(
                'hgg.settings.data',
                JSON.stringify(settingsData)
            );
            localStorage.setItem('hgg.settings.version', settings.rev);
            settingsDispatcher(settingsData);
        };

        dropbox.access_token &&
            typeof bookmarksDispatcher === 'function' &&
            typeof categoriesDispatcher === 'function' &&
            typeof settingsDispatcher === 'function' &&
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

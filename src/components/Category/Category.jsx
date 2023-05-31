import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { useBookmarks } from '../../contexts/BookmarksProvider';
import { useSettings } from '../../contexts/SettingsProvider';
import Handle from '../Handle/Handle';
import Bookmark from '../Bookmark/Bookmark';
import { ReactComponent as ArrowSvg } from '../../images/icons/arrow.svg';
import { ReactComponent as MoveSvg } from '../../images/icons/move.svg';

import styles from './Category.module.scss';

const Category = ({ draggable, group, index, name }) => {
    const container = useRef();

    const {
        bookmarks: { items: bookmarks },
    } = useBookmarks();
    const { settings } = useSettings();

    const [isDragging, setIsDragging] = useState(false);
    const [categoryBookmarks, setCategoryBookmarks] = useState([]);

    useEffect(() => {
        if (bookmarks.length === 0 && settings.length === 0) return;

        let filtered;

        if (group === 'favorites') {
            filtered = bookmarks.filter((bookmark) => bookmark.favorite);
        } else {
            filtered = bookmarks.filter(
                (bookmark) => bookmark.category === group
            );
        }

        if (settings.show_faves_in_group && group !== 'favorites')
            filtered = filtered.filter(
                (bookmark) => bookmark.favorite === false
            );

        filtered.sort((a, b) => a.name.localeCompare(b.name));

        setCategoryBookmarks(filtered);
    }, [group, bookmarks, settings]);

    const openAll = () =>
        categoryBookmarks.forEach((bookmark) => window.open(bookmark.link));

    return (
        <section
            className={cn(styles.container, { dragging: isDragging })}
            ref={container}
        >
            <header className={styles.header}>
                <h2 className={styles.title}>{name}</h2>
                <button className={styles.openAll} onClick={openAll}>
                    Open All
                    <ArrowSvg className={styles.arrow} />
                </button>
                {draggable && (
                    <Handle
                        container={container}
                        index={index}
                        setDragging={setIsDragging}
                    >
                        <MoveSvg className={styles.move} />
                    </Handle>
                )}
            </header>
            <ul className={styles.list}>
                {categoryBookmarks.map((bookmark) => (
                    <Bookmark key={bookmark.id} bookmark={bookmark} />
                ))}
            </ul>
        </section>
    );
};

export default Category;

import React, { useMemo } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBookmarks } from '../../contexts/BookmarksProvider';
import { useSettings } from '../../contexts/SettingsProvider';
import Bookmark from '../Bookmark/Bookmark';
import { ReactComponent as ArrowSvg } from '../../images/icons/arrow.svg';
import { ReactComponent as MoveSvg } from '../../images/icons/move.svg';

import styles from './Category.module.css';

const Category = ({ draggable, group, name }) => {
    const {
        attributes,
        listeners,
        setNodeRef: containerRef,
        setActivatorNodeRef: handleRef,
        transform,
        transition,
    } = useSortable({
        id: group,
        data: { type: 'category', accepts: ['category'] },
    });

    const {
        bookmarks: { items: bookmarks },
    } = useBookmarks();

    const { settings } = useSettings();

    const filteredBookmarks = useMemo(() => {
        let filtered;

        if (bookmarks.length === 0 && settings.length === 0) return [];

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
        return filtered;
    }, [group, bookmarks, settings]);

    const openAll = () =>
        filteredBookmarks.forEach((bookmark) => window.open(bookmark.link));

    return (
        <section
            className={cn(styles.container)}
            ref={containerRef}
            style={{
                transform: CSS.Translate.toString(transform),
                transition,
            }}
            {...attributes}
        >
            <header className={styles.header}>
                <h2 className={styles.title}>{name}</h2>
                <button
                    type="button"
                    className={styles.openAll}
                    onClick={openAll}
                >
                    Open All
                    <ArrowSvg className={styles.arrow} />
                </button>
                {draggable && (
                    <button
                        className={styles.move}
                        type="button"
                        ref={handleRef}
                        {...listeners}
                    >
                        <MoveSvg />
                    </button>
                )}
            </header>
            <ul className={styles.list}>
                {filteredBookmarks.map((bookmark) => (
                    <Bookmark key={bookmark.id} bookmark={bookmark} />
                ))}
            </ul>
        </section>
    );
};

export default Category;

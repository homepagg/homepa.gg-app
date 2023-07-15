import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Color from 'color';
import { useDraggable } from '@dnd-kit/core';

import { useSession } from '../../contexts/SessionProvider';

import styles from './Bookmark.module.css';

const Bookmark = ({ bookmark, dragging }) => {
    const { session } = useSession();
    const [accentColor, setAccentColor] = useState('');
    const container = useRef();

    const {
        attributes,
        listeners,
        setNodeRef: containerRef,
    } = useDraggable({
        id: bookmark.id,
        data: { type: 'bookmark' },
    });

    useEffect(() => {
        if (!container.current) return;

        let color;

        switch (session.theme) {
            case 'light':
                color = Color(bookmark.color).lightness(84);
                break;
            case 'dark':
                color = Color(bookmark.color).lightness(24);
                break;
            default:
                color = Color(bookmark.color);
        }

        const hsl = color.hsl().object();

        setAccentColor(
            `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`
        );
    }, [bookmark.color, container, session.theme]);

    return (
        <>
            <li
                className={cn(styles.container, {
                    [styles.dragging]: dragging,
                })}
                draggable="true"
                style={{ '--accent-color': `${accentColor}` }}
                ref={containerRef}
                {...attributes}
                {...listeners}
            >
                <a
                    className={styles.link}
                    href={bookmark.link}
                    rel="nofollow noopener"
                    title={bookmark.name}
                >
                    <span className={styles.icon}>
                        <img
                            className={styles.image}
                            alt=""
                            src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
                        />
                    </span>
                    <span className={styles.text}>{bookmark.name}</span>
                </a>
            </li>
            {/* {addingBookmark && (
                <BookmarkForm
                    bookmarkId={bookmark.id}
                    closeModal={() => setAddingBookmark(false)}
                    showModal={addingBookmark}
                />
            )} */}
        </>
    );
};

export default Bookmark;
